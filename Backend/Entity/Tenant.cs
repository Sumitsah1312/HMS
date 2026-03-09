using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace BackendApi.Api.Entity
{
    public class Tenant
    {
        public Guid tenantid { get; set; }
        public string tenantname { get; set; } = null!;
        public string tenantemail { get; set; } = null!;
        public string tenantphone { get; set; } = null!;
        public string tenantpassword { get; set; } = null!;
        public string? address { get; set; }
        public string? networkendpoint { get; set; }
        public bool inactive { get; set; } = false;
        public DateTime createddate { get; set; } = DateTime.UtcNow;
        [StringLength(128)]
        public string? createdby { get; set; }
        public DateTime? updateddate { get; set; }
        [StringLength(128)]
        public string? updatedby { get; set; }
    }
}
