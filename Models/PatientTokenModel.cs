using System.ComponentModel.DataAnnotations;

namespace BackendApi.Api.Models
{
    public class CreateNewPatientToken
    {
        public Guid? patientid { get; set; }
        
        public Guid departmentid { get; set; }
        public string? departmentname { get; set; }

        public Guid doctorid { get; set; }
        public string? doctorname { get; set; }

        public string? patientname { get; set; }
        public DateTime? dob { get; set; }
        public bool inactive { get; set; } = false;
    }

    
}
