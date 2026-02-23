using Microsoft.EntityFrameworkCore;
using BackendApi.Api.Data;
using BackendApi.Api.Interfaces;
using BackendApi.Api.Models;
using BackendApi.Api.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace BackendApi.Api.Services
{
    public class StaffRepository(DefaultDbContext _context) : IStaffRepository
    {
        public async Task<DoctorDashboardStats> GetDoctorDashboardStatsAsync(Guid doctorId, Guid tenantId)
        {
            var today = DateTime.UtcNow.Date;
            var visits = await _context.PatientDoctorVisits
                .Where(v => v.doctorid == doctorId && v.tenantid == tenantId && v.createddate.Date == today)
                .ToListAsync();

            return new DoctorDashboardStats
            {
                TotalPatientsToday = visits.Count,
                PendingPatients = visits.Count(v => v.status == "Pending"),
                CompletedPatients = visits.Count(v => v.status == "Completed"),
                ReassignedPatients = visits.Count(v => v.status == "Reassigned")
            };
        }

        public async Task<List<DoctorQueueModel>> GetDoctorQueueAsync(Guid doctorId, Guid tenantId)
        {
            var today = DateTime.UtcNow.Date;
            return await (from v in _context.PatientDoctorVisits
                          join p in _context.Patients on v.patientid equals p.patientid
                          where v.doctorid == doctorId && v.tenantid == tenantId && v.createddate.Date == today && !v.inactive
                          orderby v.token
                          select new DoctorQueueModel
                          {
                              VisitId = v.visitid,
                              PatientId = v.patientid,
                              PatientName = p.name,
                              Token = v.token ?? "",
                              Status = v.status ?? "Pending",
                              CreatedDate = v.createddate,
                              DepartmentName = v.departmentname
                          }).ToListAsync();
        }

        public async Task<ResponseModel> ReassignPatientAsync(ReassignPatientModel model, Guid tenantId)
        {
            var visit = await _context.PatientDoctorVisits.FirstOrDefaultAsync(v => v.visitid == model.VisitId && v.tenantid == tenantId);
            if (visit == null) return new ResponseModel { Success = false, Message = "Visit not found" };

            visit.doctorid = model.NewDoctorId;
            visit.doctorname = model.NewDoctorName;
            visit.departmentid = model.NewDepartmentId;
            visit.departmentname = model.NewDepartmentName;
            visit.status = "Reassigned";
            visit.updateddate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return new ResponseModel { Success = true, Message = "Patient reassigned successfully" };
        }

        public async Task<ResponseModel> UpdateVisitStatusAsync(Guid visitId, string status, Guid tenantId)
        {
            var visit = await _context.PatientDoctorVisits.FirstOrDefaultAsync(v => v.visitid == visitId && v.tenantid == tenantId);
            if (visit == null) return new ResponseModel { Success = false, Message = "Visit not found" };

            visit.status = status;
            visit.updateddate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return new ResponseModel { Success = true, Message = $"Status updated to {status}" };
        }
    }
}
