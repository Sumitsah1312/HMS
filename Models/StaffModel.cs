using System.ComponentModel.DataAnnotations;

namespace BackendApi.Api.Models
{
    public class CreateStaffVm
    {
        public Guid? staffid { get; set; }
        public string? tenantid { get; set; }
        public Guid departmentid { get; set; }
        public string? staffname { get; set; }
        public string? staffemail { get; set; }
        public string? staffphone { get; set; }
        public string? address { get; set; }
        public string? staffpassword { get; set; }
        public bool inactive { get; set; } = false;
    }

    public class StaffResponseModel : ResponseModel
    {
        public List<CreateStaffVm>? data { get; set; }
    }
}
