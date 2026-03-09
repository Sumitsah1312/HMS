
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
public class DoctorController(IStaffRepository _doctorRepository, IPatientRepository _patientRepository) : ControllerBase
{
    // private async Task<(Guid doctorId, Guid tenantId)> GetCurrentDoctor()
    // {
    //      var tenantid=User.Identity.GetTenantId();
    //     var userid=User.Identity.GetUserId();

    //     if (string.IsNullOrEmpty(userid)) return (Guid.Empty, tenantId);
        
    //     var doctor = await _doctorRepository.GetDoctorByEmailAsync(email, tenantId);
    //     return (doctor?.staffid ?? Guid.Empty, tenantId);
    // }

    [HttpGet]
    public async Task<IActionResult> GetDashboardStats()
    {

         var tenantid=User.Identity.GetTenantId();
        var userid=User.Identity.GetUserId();

        var stats = await _doctorRepository.GetDoctorDashboardStatsAsync(Guid.Parse(userid), tenantid);
        return Ok(stats);
    }

    [HttpGet]
    public async Task<IActionResult> GetQueue()
    {
         var tenantid=User.Identity.GetTenantId();
        var userid=User.Identity.GetUserId();

        var queue = await _doctorRepository.GetDoctorQueueAsync(userid, tenantid);
        return Ok(queue);
    }

    [HttpPost]
    public async Task<IActionResult> ReassignPatient(ReassignPatientModel model)
    {
        var tenantId = User.Identity.GetTenantId();
        var result = await _doctorRepository.ReassignPatientAsync(model, tenantId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateStatus(Guid visitId, string status)
    {
        var tenantId = User.Identity.GetTenantId();
        var result = await _doctorRepository.UpdateVisitStatusAsync(visitId, status, tenantId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetReferralDepartments()
    {
        var tenantId = User.Identity.GetTenantId();
        var result = await _patientRepository.GetDepartmentDropdown(tenantId);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetReferralStaff(Guid departmentId)
    {
        var tenantId = User.Identity.GetTenantId();
        var result = await _patientRepository.GetStaffDropdown(tenantId, departmentId);
        return Ok(result);
    }
}