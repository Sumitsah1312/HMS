using BackendApi.Api.Models;
using BackendApi.Api.Entity;

namespace BackendApi.Api.Interfaces
{
    public interface ITenantRepository
    {
        Task<TenantDashboardDataResponseModel> GetTenantDashboardData(Guid tenantid);
        Task<ResponseModel> CreateDepartmentAsync(Departments department);
        Task<DepartmentResponseModel> GetDepartmentListAsync(Guid tenantId);
        Task<CreateDepartmentVm?> GetDeptModelById(Guid? departmentid);
        Task<ResponseModel> UpdateDepartmentAsync(CreateDepartmentVm Vm, string userId);
        bool IsDepartmentExist(Guid tenantId, string name);
        Task<ResponseModel> CreateStaffAsync(Staff staff);
        Task<StaffResponseModel> GetStaffListAsync(Guid tenantId);
        Task<CreateStaffVm?> GetStaffById(Guid staffId);
        Task<ResponseModel> UpdateStaffAsync(CreateStaffVm model, string userId);
        bool IsStaffExist(Guid tenantId, string email);
        Task<DDResponseModel> GetStaffDropdown(Guid? tenantid);

        Task<DDResponseModel> GetDepartmentDropdown(Guid? tenantid);
        Task<DDResponseModel> GetMaritalStatusDropdown(Guid? tenantid);
    }
}