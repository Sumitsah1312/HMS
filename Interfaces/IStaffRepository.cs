using BackendApi.Api.Entity;
using BackendApi.Api.Models;

namespace BackendApi.Api.Interfaces
{
    public interface IStaffRepository
    {
        // Task<Staff?> GetDoctorByEmailAsync(string email, Guid tenantId);
        Task<DoctorDashboardStats> GetDoctorDashboardStatsAsync(Guid doctorId, Guid tenantId);
        Task<List<DoctorQueueModel>> GetDoctorQueueAsync(string userid,  Guid tenantId);
        Task<ResponseModel> ReassignPatientAsync(ReassignPatientModel model, Guid tenantId);
        Task<ResponseModel> UpdateVisitStatusAsync(Guid visitId, string status, Guid tenantId);
    }
}