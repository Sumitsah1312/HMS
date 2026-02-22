using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace BackendApi.Api.Entity
{
    public class Departments
    {
        [Key]
        public Guid departmentid { get; set; }
        public Guid tenantid { get; set; }
        public Guid? headid { get; set; }
        [StringLength(100)]
        public string name { get; set; } = null!;
        public string? description { get; set; }
        public bool inactive { get; set; }
        public DateTime createddate { get; set; } = DateTime.UtcNow;
        [StringLength(128)]
        public string? createdby { get; set; }
        public DateTime? updateddate { get; set; }
        [StringLength(128)]
        public string? updatedby { get; set; }
    }
}
