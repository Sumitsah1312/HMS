using BackendApi.Api.Models;
using BackendApi.Api.Entity;
using System.Threading.Tasks;
using System.Collections.Generic; // Added for IEnumerable
using System; // Added for Guid

namespace BackendApi.Api.Interfaces
{
    public interface IPatientRepository
    {
        Task<ResponseModel> CreatePatientTokenAsync(CreateNewPatientToken model,Guid tenantid, string userid);
        Task<IEnumerable<PatientDoctorVisit>> GetPatientVisitsAsync(Guid patientid, Guid tenantid);
        Task<Patient?> GetPatientByUserIdAsync(string userid, Guid tenantid);
        Task<IEnumerable<Patient>> GetPatientsAsync(Guid tenantid, string userid);
        Task<DDResponseModel> GetMaritalStatusDropdown(Guid? tenantid);
        Task<DDResponseModel> GetDepartmentDropdown(Guid? tenantid);
        Task<DDResponseModel> GetStaffDropdown(Guid? tenantid, Guid? departmentid);
    }
}