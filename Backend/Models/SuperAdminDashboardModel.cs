using BackendApi.Api.Models;

namespace BackendApi.Api.Models
{
    public class SuperAdminDashboardDataVm
    {
        public int TotalActiveTenantCount { get; set; }
        public int TotalActiveDoctorCount { get; set; }
    }

    public class SuperAdminDashboardDataResponseModel : ResponseModel
    {
        public SuperAdminDashboardDataVm? data { get; set; }
    }
}
