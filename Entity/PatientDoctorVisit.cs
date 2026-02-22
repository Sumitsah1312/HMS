using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Api.Entity
{
    public class PatientDoctorVisit
    {
        [Key]
        public Guid visitid { get; set; }

        public Guid tenantid { get; set; }

        public Guid patientid { get; set; }
        public Guid departmentid { get; set; }
        public Guid doctorid { get; set; }

        [StringLength(100)]
        public string departmentname { get; set; } = null!;

        [StringLength(100)]
        public string doctorname { get; set; } = null!;

        public bool inactive { get; set; } = false;

        public DateTime createddate { get; set; } = DateTime.UtcNow;
        public string? createdby { get; set; }

        public DateTime? updateddate { get; set; }
        public string? updatedby { get; set; }

    }
}
