using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

namespace BackendApi.Api.Helpers
{
    public class CustomAuthorizationMiddlewareResultHandler : IAuthorizationMiddlewareResultHandler
    {
        private readonly AuthorizationMiddlewareResultHandler DefaultHandler = new();

        public async Task HandleAsync(
            RequestDelegate next,
            HttpContext context,
            AuthorizationPolicy policy,
            PolicyAuthorizationResult authorizeResult)
        {
            if (authorizeResult.Forbidden && context.User.Identity?.IsAuthenticated == true)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonSerializer.Serialize(new
                {
                    success = false,
                    isLogOut = true,
                    message = "You are not authorized to access this resource. Contact your administrator."
                }));
                return;
            }
            else if (context.User.Identity?.IsAuthenticated == false)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonSerializer.Serialize(new
                {
                    success = false,
                    isLogOut = true,
                    message = "You are not authorized. Contact your administrator."
                }));
                return;
            }

            await DefaultHandler.HandleAsync(next, context, policy, authorizeResult);
        }
    }

}
