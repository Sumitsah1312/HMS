
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.RenderTree;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using BackendApi.Api.Entity;
using BackendApi.Api.Helpers;
using BackendApi.Api.Interfaces;
using BackendApi.Api.Models;
using BackendApi.Api.Services;
using System.Text;
using System.Timers;
using static System.Runtime.InteropServices.JavaScript.JSType;
namespace BackendApi.Api.Controllers.V1;

[Route("api/[controller]/[action]")]
[ApiController]
// [Authorize(Policy = "UserPolicy")]
public class SuperAdminController(ISuperAdminRepository _superadminRepository) : ControllerBase
{

    [HttpGet]
    public async Task<IActionResult> GetSuperAdminDashboardData()
    {

        var result = await _superadminRepository.GetSuperAdminDashboardData();

        if (!result.Success)
            return BadRequest(new { success = false, message = result.Message });

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
            result.data
        });
    }
    [HttpPost]
    public async Task<IActionResult> CreateTenant([FromBody] CreateTenantVm model)
    {
        var userid = User.Identity.GetUserId();
        var result = await _superadminRepository.CreateTenantAsync(model, userid);

        if (!result.Success)
            return BadRequest(new { success = false, message = result.Message });

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
        });
    }




    [HttpPost]
    public async Task<IActionResult> UpdateTenant([FromBody] UpdateTenantVm model)
    {
        var userid = User.Identity.GetUserId();
        var result = await _superadminRepository.UpdateTenantAsync(model, userid);

        if (!result.Success)
            return BadRequest(new { success = false, message = result.Message });

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
        });
    }
    [HttpGet]
    public async Task<IActionResult> TenantList()
    {
        var result = await _superadminRepository.GetAllTenantsAsync();
        if (!result.Success)
            return BadRequest(new { success = false, message = result.Message });

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
            result.data
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetTenantById(Guid id)
    {
        var result = await _superadminRepository.GetTenantByIdAsync(id);
        if (!result.Success)
            return BadRequest(new { success = false, message = result.Message });

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
            result.data
        });
    }
}