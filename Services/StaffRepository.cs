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
        public async Task<Staff?> GetDoctorByEmailAsync(string email, Guid tenantId)
        {
            return await _context.Staff.FirstOrDefaultAsync(s => s.staffemail == email && s.tenantid == tenantId && !s.inactive);
        }

        public async Task<DoctorDashboardStats> GetDoctorDashboardStatsAsync(Guid doctorId, Guid tenantId)
        {
            var today = DateTime.UtcNow.Date;
            var visits = await _context.PatientDoctorVisits
                .Where(v => v.doctorid == doctorId && v.tenantid == tenantId && v.createddate.Date == today)
                .ToListAsync();

            return new DoctorDashboardStats
            {
                TotalPatientsToday = visits.Count,
                PendingPatients = visits.Count(v => v.status == EnumModelVisitStatus.waiting.ToString()),
                CompletedPatients = visits.Count(v => v.status == EnumModelVisitStatus.completed.ToString()),
                ReassignedPatients = visits.Count(v => v.status == EnumModelVisitStatus.referred.ToString())
            };
        }

        public async Task<List<DoctorQueueModel>> GetDoctorQueueAsync(string userid, Guid tenantId)
        {
            var today = DateTime.UtcNow.Date;
             var doctor= await _context.Staff.FirstOrDefaultAsync(x=>x.userid.ToString()==userid);
            if(doctor==null){
                return new List<DoctorQueueModel>();
            }
            return await (from v in _context.PatientDoctorVisits
                          join p in _context.Patients on v.patientid equals p.patientid
                          where v.doctorid == doctor.staffid && v.tenantid == tenantId && v.createddate.Date == today && !v.inactive
                          orderby v.token
                          select new DoctorQueueModel
                          {
                              VisitId = v.visitid,
                              PatientId = v.patientid,
                              PatientName = p.name,
                              Token = v.token ?? "",
                              Status = v.status ?? EnumModelVisitStatus.waiting.ToString(),
                              CreatedDate = v.createddate,
                              DepartmentName = v.departmentname
                          }).ToListAsync();
        }

        public async Task<ResponseModel> ReassignPatientAsync(ReassignPatientModel model, Guid tenantId)
        {
            var visit = await _context.PatientDoctorVisits.FirstOrDefaultAsync(v => v.visitid == model.VisitId && v.tenantid == tenantId);
            if (visit == null) return new ResponseModel { Success = false, Message = "Visit not found" };

            // 1. Mark current visit as referred (completes it for current doctor)
            visit.status = EnumModelVisitStatus.referred.ToString();
            visit.updateddate = DateTime.UtcNow;

            // 2. Create a new visit for the target doctor
            var newVisit = new PatientDoctorVisit
            {
                visitid = Guid.NewGuid(),
                tenantid = tenantId,
                patientid = visit.patientid,
                departmentid = model.NewDepartmentId,
                departmentname = model.NewDepartmentName,
                doctorid = model.NewDoctorId,
                doctorname = model.NewDoctorName,
                token = visit.token,
                status = EnumModelVisitStatus.waiting.ToString(),
                createddate = DateTime.UtcNow,
                createdby = visit.doctorname // Internal note
            };

            await _context.PatientDoctorVisits.AddAsync(newVisit);
            await _context.SaveChangesAsync();
            return new ResponseModel { Success = true, Message = "Patient referred successfully" };
        }

        public async Task<ResponseModel> UpdateVisitStatusAsync(Guid visitId, string status, Guid tenantId)
        {
            var visit = await _context.PatientDoctorVisits.FirstOrDefaultAsync(v => v.visitid == visitId && v.tenantid == tenantId);
            if (visit == null) return new ResponseModel { Success = false, Message = "Visit not found" };

            visit.status = status.ToLower(); // Ensure lowercase
            visit.updateddate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return new ResponseModel { Success = true, Message = $"Status updated to {status}" };
        }
    }
}
