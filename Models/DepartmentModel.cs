using System.ComponentModel.DataAnnotations;

namespace BackendApi.Api.Models
{
    public class CreateDepartmentVm
    {
        public string? tenantid { get; set; }
        public Guid? departmentid { get; set; }
        public Guid? headid { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
        public bool inactive { get; set; } = false;
    }

    public class DepartmentResponseModel : ResponseModel
    {
        public List<CreateDepartmentVm>? data { get; set; }        
    }
    
    

   
}
