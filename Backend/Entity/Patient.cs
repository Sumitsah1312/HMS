using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Api.Entity
{
    public class Patient
    {
        [Key]
        public Guid patientid { get; set; }

        public Guid tenantid { get; set; }

        [StringLength(100)]
        public string name { get; set; } = null!;

        public DateTime dob { get; set; }

        public bool inactive { get; set; } = false;

        public DateTime createddate { get; set; } = DateTime.UtcNow;
        public string? createdby { get; set; }

        public DateTime? updateddate { get; set; }
        public string? updatedby { get; set; }

    }
}
