using Microsoft.AspNetCore.Mvc;
using BackendApi.Api.Models;
using System.Reflection;
using System.Security.Claims;
using System.Security.Principal;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace BackendApi.Api.Helpers
{
    public static class MyHelpers
    {
        public static string GetUserId(this IIdentity? identity)
        {
            if (identity == null)
                throw new ArgumentNullException("identity");
            string userId = "";
            var claimsIdentity = identity as ClaimsIdentity;
            Claim? claim = claimsIdentity?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (claim != null)
                userId = claim.Value;
            return userId;
        }
        public static Guid GetTenantId(this IIdentity? identity)
        {
            if (identity == null)
                throw new ArgumentNullException(nameof(identity));

            var claimsIdentity = identity as ClaimsIdentity;
            var claim = claimsIdentity?.Claims?.FirstOrDefault(c => c.Type == ClaimTypesCustom.TenantId);

            if (claim != null && Guid.TryParse(claim.Value, out Guid tenantId))
            {
                return tenantId;
            }

            return Guid.Empty; // return empty if not found or invalid
        }
        public static List<string>? GetUserRoles(this IIdentity? identity)
        {
            if (identity == null)
                throw new ArgumentNullException(nameof(identity));
            var claimsIdentity = identity as ClaimsIdentity;

            return claimsIdentity?.Claims?.Where(c => c.Type == "role")
                 .Select(c => c.Value)
                 .ToList();
        }
        public static string GetFullUrl(this HttpContext? httpContext)
        {
            var result = "";
            if (httpContext != null)
            {
                var request = httpContext.Request;
                result = $"{request.Scheme}://{request.Host}{request.PathBase}";
            }
            return result;
        }
        public static string ToSnakeCase(this string input)
        {
            if (string.IsNullOrEmpty(input)) { return input; }
            return input.ToLower();
        }
        public static string GenerateDomainSlug(string companyName)
        {
            if (string.IsNullOrWhiteSpace(companyName))
                return "tenant" + Guid.NewGuid().ToString("N");

            var suffixes = new[] { "pvt", "private", "ltd", "limited", "inc", "llc", "corp", "corporation", "co" };

            var cleanedName = companyName.ToLowerInvariant();

            foreach (var suffix in suffixes)
            {
                cleanedName = Regex.Replace(cleanedName, $@"\b{suffix}\b", "", RegexOptions.IgnoreCase);
            }

            cleanedName = Regex.Replace(cleanedName, @"\s+", "");

            var slug = Regex.Replace(cleanedName, @"[^a-z0-9]", string.Empty);

            return slug;
        }

        public static class ClaimTypesCustom
        {
            public const string TenantId = "http://schemas.xmlsoap.org/ws/2009/09/identity/claims/TenantId";
        }
        public static string GenerateCode(int length = 8)
        {
            char[] _chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".ToCharArray();

            var random = new Random();
            var code = new char[length];

            for (int i = 0; i < length; i++)
            {
                code[i] = _chars[random.Next(_chars.Length)];
            }

            return new string(code);
        }
        //public static IActionResult HandleServiceResponse(this ResponseModel? response, string? successMessage, object? data = null)
        //{
        //    if (response == null)
        //        return new BadRequestObjectResult(new { success = false, message = "Some error occurred. Please try again." });

        //    if (!response.Success)
        //    {
        //        var message = string.IsNullOrEmpty(response.Message)
        //            ? "Some error occurred. Please try again."
        //            : response.Message;

        //        return new BadRequestObjectResult(new { success = false, message });
        //    }

        //    return new OkObjectResult(new
        //    {
        //        success = true,
        //        message = successMessage,
        //        data = data
        //    });
        //}
        public static IActionResult HandleServiceResponse<T>(this T response, string? successMessage = null)
        {
            if (response == null)
                return new BadRequestObjectResult(new { success = false, message = "Some error occurred. Please try again." });

            var type = typeof(T);

            // Case-insensitive property lookup
            var successProp = type.GetProperty("success", BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance) ?? type.GetProperty("Success", BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            var messageProp = type.GetProperty("message", BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance) ?? type.GetProperty("Message", BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

            bool successValue = false;
            if (successProp != null && successProp.PropertyType == typeof(bool))
                successValue = (successProp.GetValue(response) as bool?) ?? false;

            string? messageValue = null;
            if (messageProp != null && messageProp.PropertyType == typeof(string))
                messageValue = (string?)messageProp.GetValue(response);

            // ✅ enforce camelCase in output
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };


            if (successProp == null)
            {
                // Serialize the response first
                var json = JsonSerializer.Serialize(response, options);

                object? data;
                if (json.TrimStart().StartsWith("[")) // array
                {
                    data = JsonSerializer.Deserialize<List<object>>(json, options);
                }
                else // single object
                {
                    data = JsonSerializer.Deserialize<Dictionary<string, object>>(json, options);
                }

                var dict = new Dictionary<string, object?>
                {
                    ["success"] = true,
                    ["message"] = successMessage ?? messageValue ?? "",
                    ["data"] = data
                };
                return new OkObjectResult(dict);
            }
            else
            {
                var json = JsonSerializer.Serialize(response, options);
                var dict = JsonSerializer.Deserialize<Dictionary<string, object>>(json, options) ?? new Dictionary<string, object>();

                if (!successValue)
                {
                    dict["success"] = false;
                    dict["message"] = messageValue ?? "Some error occurred. Please try again.";
                    return new BadRequestObjectResult(dict);
                }
                else
                {
                    dict["success"] = true;
                    dict["message"] = successMessage ?? messageValue ?? "";
                    return new OkObjectResult(dict);
                }
            }
        }




    }
}
