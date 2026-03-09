using System.ComponentModel.DataAnnotations;

namespace BackendApi.Api.Models
{
    public class SendLoginOtpVm
    {
        [Required(ErrorMessage = "Please enter Email id or Mobile number.")]
        public string? UserName { get; set; }
    }
    public class AuthenticateOtpVm
    {
        [Required(ErrorMessage = "Please enter otp to continue.")]
        public string? Otp { get; set; }
        public string? UserName { get; set; }
    }
    public class IsUserOtpValidModel
    {
        public bool IsValid { get; set; }
        public string? Message { get; set; }
    }
}
