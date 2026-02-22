using BackendApi.Api.Models;

namespace BackendApi.Api.Models
{
    public class TenantDashboardDataVm
    {
        public Guid? tenantid { get; set; }
        public int TotalActiveDoctorCount { get; set; }=0;
        public int TotalPatientCount { get; set; }=0;
        public int PendingQueue { get; set; }=0;
        public int NewPatient { get; set; }=0;
    }

    public class TenantDashboardDataResponseModel : ResponseModel
    {
        public TenantDashboardDataVm? data { get; set; }
    }
}
