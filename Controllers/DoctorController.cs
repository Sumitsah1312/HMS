
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
public class DoctorController(IStaffRepository _doctorRepository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetDashboardStats(Guid doctorId, Guid tenantId)
    {
        var stats = await _doctorRepository.GetDoctorDashboardStatsAsync(doctorId, tenantId);
        return Ok(stats);
    }

    [HttpGet]
    public async Task<IActionResult> GetQueue(Guid doctorId, Guid tenantId)
    {
        var queue = await _doctorRepository.GetDoctorQueueAsync(doctorId, tenantId);
        return Ok(queue);
    }

    [HttpPost]
    public async Task<IActionResult> ReassignPatient(ReassignPatientModel model, Guid tenantId)
    {
        var result = await _doctorRepository.ReassignPatientAsync(model, tenantId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateStatus(Guid visitId, string status, Guid tenantId)
    {
        var result = await _doctorRepository.UpdateVisitStatusAsync(visitId, status, tenantId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}