namespace BackendApi.Api.Models
{
    public class LoginModel
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
    public class CreateAccountModel
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
    public class RegisterPatientModel
    {
        public Guid? tenantid { get; set; }
        public string FullName { get; set; } = null!;
        public DateTime DateofBirth { get; set; } 
        public string? Gender { get; set; } 
        public string? MobileNumber { get; set; } 
        public string? Email { get; set; } 
        public string? Address { get; set; } 
        
    }
}