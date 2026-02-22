
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BackendApi.Api.Models;
using BackendApi.Api.Entity;
using BackendApi.Api.Helpers;
using System.Text.RegularExpressions;

namespace BackendApi.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userMgr;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly IConfiguration _config;

        public AccountController(
            RoleManager<IdentityRole<Guid>> roleManager,
            UserManager<ApplicationUser> userMgr,
            IConfiguration config)
        {
            _userMgr = userMgr;
            _roleManager = roleManager;
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Incoming request is not valid." });

            if (string.IsNullOrWhiteSpace(login.Username))
                return BadRequest(new { success = false, message = "Username is required." });

            var user = await _userMgr.FindByNameAsync(login.Username);
            if (user == null)
                user = await _userMgr.FindByEmailAsync(login.Username);

            if (user == null)
                return BadRequest(new { success = false, message = "No such account exists!" });

            bool isPasswordCorrect = await _userMgr.CheckPasswordAsync(user, login.Password ?? "");
            if (isPasswordCorrect)
            {
                var claims = new List<Claim>
                {
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new(ClaimTypes.Name, user.UserName ?? ""),
                    new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new(MyHelpers.ClaimTypesCustom.TenantId, user.tenantid?.ToString() ?? Guid.Empty.ToString())
                };

                var roles = await _userMgr.GetRolesAsync(user);
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtIssuerOptions:Key"] ?? ""));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var securityToken = new JwtSecurityToken(
                    issuer: _config["JwtIssuerOptions:Issuer"],
                    audience: _config["JwtIssuerOptions:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddDays(Convert.ToDouble(_config["JwtIssuerOptions:Expires"] ?? "7")),
                    signingCredentials: creds);

                var token = new JwtSecurityTokenHandler().WriteToken(securityToken);

                return Ok(new
                {
                    success = true,
                    token = token,
                    expiration = securityToken.ValidTo,
                    userName = user.UserName,
                    userId = user.Id,
                    roles = roles,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber
                });
            }
            return BadRequest(new { success = false, message = "Username or Password does not match" });
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] CreateAccountModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Invalid data" });

            var existingUser = await _userMgr.FindByEmailAsync(model.Email);
            if (existingUser != null)
                return BadRequest(new { success = false, message = "User already exists with this Email" });

            var applicationUser = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Email,
                EmailConfirmed = true
            };

            var result = await _userMgr.CreateAsync(applicationUser, model.Password);
            if (result.Succeeded)
            {
                // Ensure the role exists
                // const string defaultRole = "admin";
                if (!await _roleManager.RoleExistsAsync(model.Role))
                {
                    await _roleManager.CreateAsync(new IdentityRole<Guid> { Name = model.Role });
                }

                await _userMgr.AddToRoleAsync(applicationUser, model.Role);
                return Ok(new { success = true, message = "Account created successfully with admin role." });
            }

            return BadRequest(new { success = false, message = "Unable to create account", errors = result.Errors });
        }

        private bool IsValidPhoneNumber(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return false;

            input = input.Trim();

            // Indian mobile number validation
            var pattern = @"^(\+91|91|0)?[6-9]\d{9}$";

            return Regex.IsMatch(input, pattern);
        }

        private async Task<object> GenerateLoginResponse(ApplicationUser user)
        {
            var claims = new List<Claim>
    {
        new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new(ClaimTypes.Name, user.UserName ?? ""),
        new(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new(MyHelpers.ClaimTypesCustom.TenantId, user.tenantid?.ToString() ?? Guid.Empty.ToString())
    };

            var roles = await _userMgr.GetRolesAsync(user);
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtIssuerOptions:Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var securityToken = new JwtSecurityToken(
                issuer: _config["JwtIssuerOptions:Issuer"],
                audience: _config["JwtIssuerOptions:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(Convert.ToDouble(_config["JwtIssuerOptions:Expires"] ?? "7")),
                signingCredentials: creds);

            return new
            {
                success = true,
                token = new JwtSecurityTokenHandler().WriteToken(securityToken),
                expiration = securityToken.ValidTo,
                userName = user.UserName,
                userId = user.Id,
                roles = roles,
                phoneNumber = user.PhoneNumber,
                ispatient = true
            };
        }


        [HttpPost]
        public async Task<IActionResult> SendOtp([FromBody] SendLoginOtpVm model)
        {
            // Implement OTP generation and sending logic here
            if (model == null || string.IsNullOrEmpty(model.UserName))
                return BadRequest(new { success = false, message = "Please provide a valid username." });

            if (IsValidPhoneNumber(model.UserName))
            {
                // Generate OTP and send to phone number
                // Example: await _otpService.SendOtpToPhoneAsync(model.UserName);
                var otp = "19876"; // Replace with actual OTP generation logic
                return Ok(new { success = true, message = $"OTP sent to phone number {model.UserName}", otp = otp });
            }
            else
            {
                return BadRequest(new { success = false, message = "Please provide a valid email or phone number." });
            }
        }
        [HttpPost]
        public async Task<IActionResult> AuthenticateOtpPatient([FromBody] AuthenticateOtpVm model)
        {
            // Implement OTP generation and sending logic here
            if (model == null || string.IsNullOrEmpty(model.Otp))
                return BadRequest(new { success = false, message = "Please provide a valid otp." });

            // // 🔹 VERIFY OTP HERE
            // var isOtpValid = await _otpService.VerifyOtpAsync(phone, model.Otp);
            // if (!isOtpValid)
            //     return BadRequest(new { success = false, message = "Invalid or expired OTP" });
            
            // return Ok(new { success = true, message = $"OTP authenticated successfully.", ispatient = false });

            // 🔹 CHECK USER EXISTS
            var existingUser = _userMgr.Users.FirstOrDefault(x => x.UserName == model.UserName);

            // CASE 1: EXISTING PATIENT → LOGIN
            if (existingUser != null)
            {
                var loginResponse = await GenerateLoginResponse(existingUser);
                return Ok(loginResponse);
            }

            // CASE 2: NEW PATIENT → OPEN REGISTRATION
            return Ok(new { success = true, message = $"OTP authenticated successfully.", ispatient = false });
            
        }

        public static string Normalize(string phone)
        {
            phone = phone.Trim().Replace(" ", "");

            if (phone.StartsWith("+91"))
                phone = phone.Substring(3);
            else if (phone.StartsWith("91"))
                phone = phone.Substring(2);
            else if (phone.StartsWith("0"))
                phone = phone.Substring(1);


            return phone;
        }

        public static bool IsValidIndianPhone(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return false;

            return Regex.IsMatch(Normalize(phone), @"^[6-9]\d{9}$");
        }

        [HttpPost]
        public async Task<IActionResult> RegisterPatient([FromBody] RegisterPatientModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid data" });

                if (!IsValidIndianPhone(model.MobileNumber ?? ""))
                    return BadRequest(new { success = false, message = "Invalid phone number" });

                string phone = Normalize(model.MobileNumber ?? "");

                // check existing user by phone
                var existingUser = _userMgr.Users.FirstOrDefault(x => x.UserName == phone);

                if (existingUser != null)
                    return BadRequest(new { success = false, message = "User already exists with this phone number" });

                var applicationUser = new ApplicationUser
                {
                    tenantid = model.tenantid,
                    PhoneNumber = phone,
                    UserName = phone,                // IMPORTANT (Identity requires unique username)
                    PhoneNumberConfirmed = true,     // OTP already verified
                    EmailConfirmed = true            // optional (avoid identity validation issues)
                };

                var result = await _userMgr.CreateAsync(applicationUser);

                if (!result.Succeeded)
                    return BadRequest(new { success = false, message = "Unable to create account", errors = result.Errors });

                // Ensure role exists
                if (!await _roleManager.RoleExistsAsync(EnumModelRole.patient.ToString()))
                    await _roleManager.CreateAsync(new IdentityRole<Guid> { Name = EnumModelRole.patient.ToString() });

                await _userMgr.AddToRoleAsync(applicationUser, EnumModelRole.patient.ToString());

                var claims = new List<Claim>
                {
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new(ClaimTypes.Name, applicationUser.UserName ?? ""),
                    new(ClaimTypes.NameIdentifier, applicationUser.Id.ToString()),
                    new(MyHelpers.ClaimTypesCustom.TenantId, applicationUser.tenantid?.ToString() ?? Guid.Empty.ToString())
                };

                var roles = await _userMgr.GetRolesAsync(applicationUser);
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtIssuerOptions:Key"] ?? ""));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var securityToken = new JwtSecurityToken(
                    issuer: _config["JwtIssuerOptions:Issuer"],
                    audience: _config["JwtIssuerOptions:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddDays(Convert.ToDouble(_config["JwtIssuerOptions:Expires"] ?? "7")),
                    signingCredentials: creds);

                var token = new JwtSecurityTokenHandler().WriteToken(securityToken);

                return Ok(new
                {
                    success = true,
                    token = token,
                    expiration = securityToken.ValidTo,
                    userName = applicationUser.UserName,
                    userId = applicationUser.Id,
                    roles = roles,
                    email = applicationUser.Email,
                    phoneNumber = applicationUser.PhoneNumber
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "An error occurred while registering the patient.", error = ex.Message });
            }
        }
    }


}
