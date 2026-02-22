
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
namespace BackendApi.Api.Controllers.V1;

[Route("api/[controller]/[action]")]
[ApiController]
// [Authorize(Policy = "UserPolicy")]
public class PatientController(IPatientRepository _patientRepository) : ControllerBase
{

    [HttpPost]
    public async Task<IActionResult> CreatePatientToken([FromBody] CreateNewPatientToken model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var tenantid=User.Identity.GetTenantId();
        var userid=User.Identity.GetUserId();

        var result = await _patientRepository.CreatePatientTokenAsync(model,tenantid,userid);
        if (result.Success)
            return Ok(new { success= true,message = result.Message });

        return BadRequest(new { success= false,message = result.Message });
    }

    [HttpGet]
    public async Task<IActionResult> GetMyVisits()
    {
        var tenantid = User.Identity.GetTenantId();
        var userid = User.Identity.GetUserId();

        var patient = await _patientRepository.GetPatientByUserIdAsync(userid, tenantid);
        if (patient == null)
            return Ok(new { success = true, data = new List<PatientDoctorVisit>() });

        var visits = await _patientRepository.GetPatientVisitsAsync(patient.patientid, tenantid);
        return Ok(new { success = true, data = visits });
    }

    [HttpGet]
    public async Task<IActionResult> GetPatients()
    {
        var tenantid = User.Identity.GetTenantId();
        var userid = User.Identity.GetUserId();
        var patients = await _patientRepository.GetPatientsAsync(tenantid, userid);
        return Ok(new { success = true, data = patients });
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartmentDropdown()
    {
        var result = await _patientRepository.GetDepartmentDropdown(User.Identity.GetTenantId());

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
    public async Task<IActionResult> GetMaritalStatusDropdown()
    {
        var result = await _patientRepository.GetMaritalStatusDropdown(User.Identity.GetTenantId());

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
    public async Task<IActionResult> GetStaffDropdown(Guid? departmentid)
    {
        var result = await _patientRepository.GetStaffDropdown(User.Identity.GetTenantId(),departmentid);

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