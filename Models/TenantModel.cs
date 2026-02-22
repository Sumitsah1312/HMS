using System.ComponentModel.DataAnnotations;

namespace BackendApi.Api.Models
{
    public class CreateTenantVm
    {
        public Guid? tenantid { get; set; }
        public string tenantname { get; set; } = null!;
        public string tenantemail { get; set; } = null!;
        public string tenantphone { get; set; } = null!;
        public string tenantpassword { get; set; } = null!;
        public string? address { get; set; }
        public string? networkendpoint { get; set; }
        public bool inactive { get; set; } = false;
    }
    public class TenantListResponseModel : ResponseModel
    {
        public List<CreateTenantVm>? data { get; set; }
    }
    public class TenantByIdResponseModel : ResponseModel
    {
        public CreateTenantVm? data { get; set; }
    }

    public class UpdateTenantVm
    {
        public Guid tenantid { get; set; }
        public string tenantname { get; set; } = null!;
        public string? address { get; set; }
        public string? networkendpoint { get; set; }
        public bool inactive { get; set; } = false;
    }
}
