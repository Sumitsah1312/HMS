using Microsoft.EntityFrameworkCore;
using BackendApi.Api.Data;
using BackendApi.Api.Interfaces;
using BackendApi.Api.Models;
using BackendApi.Api.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BackendApi.Api.Services
{
    public class PatientRepository(
        DefaultDbContext _ctx) : IPatientRepository
    {
        public async Task<ResponseModel> CreatePatientTokenAsync(CreateNewPatientToken model,Guid tenantid, string userid)
        {
             using var transaction = await _ctx.Database.BeginTransactionAsync();
            
            try
            {
               
                var result=new ResponseModel();

                
                if (model.patientid == null || model.patientid == Guid.Empty)
                {
                    // Validation for New Patient
                    if (string.IsNullOrEmpty(model.patientname)){
                        result.Success=false;
                        result.Message="Patient name is required for new registration.";
                        return result;
                    }
                    if (model.dob == null){
                        result.Success=false; 
                        result.Message="Date of birth is required for new registration.";
                        return result;
                    }
                    
                    
                    // Create New Patient
                    var newPatient = new Patient
                    {
                       
                        tenantid = tenantid,
                        name = model.patientname,
                        dob = model.dob.Value,
                        createddate = DateTime.UtcNow,
                        createdby=userid,
                        inactive = false
                    };

                    await _ctx.Patients.AddAsync(newPatient);
                    await _ctx.SaveChangesAsync();
                    model.patientid= newPatient.patientid;
                    
                }
                else
                {
                    // Returning Patient
                    var patientExists = await _ctx.Patients.AnyAsync(p => p.patientid == model.patientid && p.tenantid == tenantid);
                    if (!patientExists)
                    {
                        result.Success=false;
                        result.Message="Patient not found.";
                        return result;
                    }

                    
                }

                // Create Visit Entry
                var visit = new PatientDoctorVisit
                {
                   
                    tenantid = tenantid,
                    patientid = model.patientid??Guid.Empty,
                    departmentid = model.departmentid,
                    doctorid = model.doctorid,
                    departmentname = model.departmentname ?? "Unknown",
                    doctorname = model.doctorname ?? "Unknown",
                    createddate = DateTime.UtcNow,
                    createdby=userid,
                    inactive = false
                };

                await _ctx.PatientDoctorVisits.AddAsync(visit);
                await _ctx.SaveChangesAsync();

                 await transaction.CommitAsync();

                result.Success=true;
                result.Message="Process Completed Successfully.";
                return result;

                
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ResponseModel{Success=false,Message= $"Error creating token: {ex.Message}"};
            }
        }

        public async Task<IEnumerable<PatientDoctorVisit>> GetPatientVisitsAsync(Guid patientid, Guid tenantid)
        {
            return await _ctx.PatientDoctorVisits
                .Where(v => v.patientid == patientid && v.tenantid == tenantid)
                .OrderByDescending(v => v.createddate)
                .ToListAsync();
        }

        public async Task<Patient?> GetPatientByUserIdAsync(string userid, Guid tenantid)
        {
            return await _ctx.Patients.FirstOrDefaultAsync(p => p.createdby == userid && p.tenantid == tenantid);
        }

        public async Task<IEnumerable<Patient>> GetPatientsAsync(Guid tenantid, string userid)
        {
            return await _ctx.Patients
                .Where(p => p.tenantid == tenantid && p.createdby == userid)
                .OrderBy(p => p.name)
                .ToListAsync();
        }
        public async Task<DDResponseModel> GetStaffDropdown(Guid? tenantid, Guid? departmentid)
        {
            var result = new DDResponseModel();
            if (tenantid == null)
            {
                result.Success = false;
                result.Message = "Invalid tenant.";
                return result;
            }
            var staffList = await _ctx.Staff.Where(s => s.tenantid == tenantid && s.departmentid==departmentid && !s.inactive).ToListAsync();

            if (staffList == null || staffList.Count == 0)
            {
                result.Success = false;
                result.Message = "No staff found for this tenant and department.";
                return result;
            }

            var list = new List<SelectListItem>();
            foreach (var s in staffList)
            {
                list.Add(new SelectListItem()
                {
                    Text = s.staffname,
                    Value = s.staffid.ToString(),
                    Group = new SelectListGroup { Name = s.departmentid.ToString() }
                });
            }
            result.Success = true;
            result.data = list;
            return result;
        }
         public async Task<DDResponseModel> GetDepartmentDropdown(Guid? tenantid)
        {
            var result = new DDResponseModel();
            if (tenantid == null)
            {
                result.Success = false;
                result.Message = "Invalid tenant.";
                return result;
            }
            var dts = await _ctx.Departments.Where(m => m.tenantid == tenantid && !m.inactive).ToListAsync();

            if (dts == null || dts.Count == 0)
            {
                result.Success = false;
                result.Message = "No departments found for this tenant.";
                return result;
            }

            var list = new List<SelectListItem>();
            foreach (var r in dts)
            {
                list.Add(new SelectListItem()
                {
                    Text = r.name,
                    Value = r.departmentid.ToString()
                });
            }
            result.Success = true;
            result.data = list;
            return result;
        }
        public async Task<DDResponseModel> GetMaritalStatusDropdown(Guid? tenantid)
        {
            var result = new DDResponseModel();
            if (tenantid == null)
            {
                result.Success = false;
                result.Message = "Invalid tenant.";
                return result;
            }
            var dts = await _ctx.MaritalStatus.Where(m => m.tenantid == tenantid && !m.inactive).ToListAsync();

            if (dts == null || dts.Count == 0)
            {
                result.Success = false;
                result.Message = "No departments found for this tenant.";
                return result;
            }

            var list = new List<SelectListItem>();
            foreach (var r in dts)
            {
                list.Add(new SelectListItem()
                {
                    Text = r.name,
                    Value = r.maritalstatusid.ToString()
                });
            }
            result.Success = true;
            result.data = list;
            return result;
        }

    }
}
