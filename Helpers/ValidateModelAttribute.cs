using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
namespace BackendApi.Api.Helpers
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting([FromBody] ActionExecutingContext actionContext)
        {
            if (actionContext.ModelState != null && actionContext.ModelState.IsValid == false)
            {
                var errors = new List<string>();
                foreach (var state in actionContext.ModelState)
                {
                    if (state.Value != null && state.Value.Errors != null && state.Value.Errors.Any())
                    {
                        foreach (var error in state.Value.Errors)
                        {
                            if (!string.IsNullOrEmpty(error.ErrorMessage))
                                errors.Add(error.ErrorMessage);
                            else if (error.Exception != null)
                            {
                                if (!string.IsNullOrEmpty(error.Exception.Message))
                                    errors.Add(error.Exception.Message);
                                else if (!string.IsNullOrEmpty(error.Exception.Message))
                                    errors.Add("Incoming request is not valid.");
                            }

                        }
                    }
                }
                actionContext.Result = new BadRequestObjectResult(new { success = false, message = string.Join(", ", errors) });
            }
        }
    }
}
