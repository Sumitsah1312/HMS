using BackendApi.Api.Models;

namespace BackendApi.Api.Interfaces
{
    public interface IStaffRepository
    {
        Task<DoctorDashboardStats> GetDoctorDashboardStatsAsync(Guid doctorId, Guid tenantId);
        Task<List<DoctorQueueModel>> GetDoctorQueueAsync(Guid doctorId, Guid tenantId);
        Task<ResponseModel> ReassignPatientAsync(ReassignPatientModel model, Guid tenantId);
        Task<ResponseModel> UpdateVisitStatusAsync(Guid visitId, string status, Guid tenantId);
    }
}