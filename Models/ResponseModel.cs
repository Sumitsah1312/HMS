using Microsoft.AspNetCore.Mvc.Rendering;

namespace BackendApi.Api.Models
{
    public class ResponseModel
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        // public object? data { get; set; }
    }
    public class DDResponseModel : ResponseModel
    {
        public List<SelectListItem>? data { get; set; }
    }
}