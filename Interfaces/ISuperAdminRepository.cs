using BackendApi.Api.Models;

namespace BackendApi.Api.Interfaces
{
    public interface ISuperAdminRepository
    {
        Task<SuperAdminDashboardDataResponseModel> GetSuperAdminDashboardData();
        Task<ResponseModel> CreateTenantAsync(CreateTenantVm model, string createdBy);
        Task<ResponseModel> UpdateTenantAsync(UpdateTenantVm model, string updatedBy);
        Task<TenantListResponseModel> GetAllTenantsAsync();
        Task<TenantByIdResponseModel> GetTenantByIdAsync(Guid tenantId);
    }
}