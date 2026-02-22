using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace BackendApi.Api.Entity
{
    public class Staff
{
    [Key]
    public Guid staffid { get; set; } = Guid.NewGuid();
    public Guid tenantid { get; set; }
    public Guid departmentid { get; set; }
    [StringLength(200)]
    public string staffname { get; set; } = null!;
    [StringLength(200)]
    public string staffemail { get; set; } = null!;
    [StringLength(200)]
    public string staffphone { get; set; } = null!;
    [StringLength(200)]
    public string? address { get; set; }
    public string staffpassword { get; set; } = null!;
    public bool inactive { get; set; } = false;
    public DateTime createddate { get; set; } = DateTime.UtcNow;
    public string? createdby { get; set; }
    public DateTime? updateddate { get; set; }
    public string? updatedby { get; set; }

}

}
