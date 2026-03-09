
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
public class TenantController(ITenantRepository _tenantRepository) : ControllerBase
{

    [HttpGet]
    public async Task<IActionResult> GetTenantDashboardData()
    {
        // var tenantId = Guid.Parse("20ebf065-c5fe-405d-92f9-2aacddb54dd8");
        var tenantId = User.Identity.GetTenantId();
        var result = await _tenantRepository.GetTenantDashboardData(tenantId);
        return result.HandleServiceResponse();
    }

    [HttpPost]
    public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentVm model)
    {
        if (model == null)
            return BadRequest(new { success = false, message = "Incoming request is not valid." });

        if (string.IsNullOrEmpty(model.name))
            return BadRequest(new { success = false, message = "Invalid department name." });

        var tenantId = User.Identity.GetTenantId();
        if (tenantId == Guid.Empty)
            return BadRequest(new { success = false, message = "Tenant context not found." });

        var deptExist = _tenantRepository.IsDepartmentExist(tenantId, model.name);
        if (deptExist)
        {
            return BadRequest(new { success = false, message = "Department already exists for this tenant." });
        }

        Departments department = new Departments()
        {
            tenantid = tenantId,
            name = model.name,
            description = model.description,
            headid = model.headid ?? Guid.Empty,
            createdby = User.Identity.GetUserId(),
            createddate = DateTime.UtcNow
        };

        var result = await _tenantRepository.CreateDepartmentAsync(department);
        return result.HandleServiceResponse();
    }

    [HttpGet]
    public async Task<IActionResult> EditDepartment(Guid? departmentid)
    {
        if (departmentid == null)
            return BadRequest(new { success = false, message = "Department ID is required." });

        var departmentVm = await _tenantRepository.GetDeptModelById(departmentid);
        if (departmentVm == null)
            return NotFound(new { success = false, message = "Department not found." });

        return Ok(new { success = true, data = departmentVm });
    }

    [HttpPost]
    public async Task<IActionResult> UpdateDepartment([FromBody] CreateDepartmentVm model)
    {
        if (model == null || model.departmentid == null)
            return BadRequest(new { success = false, message = "Invalid update request." });

        var userId = User.Identity.GetUserId();
        var result = await _tenantRepository.UpdateDepartmentAsync(model, userId);

        return result.HandleServiceResponse();
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartmentList()
    {
        var tenantId = User.Identity.GetTenantId();
        if (tenantId == Guid.Empty)
            return BadRequest(new { success = false, message = "Tenant context not found." });

        var result = await _tenantRepository.GetDepartmentListAsync(tenantId);
        return result.HandleServiceResponse();
    }
    [HttpGet]
    public async Task<IActionResult> GetDepartmentDropdown()
    {
        var result = await _tenantRepository.GetDepartmentDropdown(User.Identity.GetTenantId());

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
        var result = await _tenantRepository.GetMaritalStatusDropdown(User.Identity.GetTenantId());

        if (!result.Success)
            return BadRequest(new { success = false, message = result.Message });

        return Ok(new
        {
            success = result.Success,
            message = result.Message,
            result.data
        });
    }

    // ===================================
    // STAFF
    // ===================================

    [HttpPost]
    public async Task<IActionResult> CreateStaff([FromBody] CreateStaffVm model)
    {
        var tenantId = User.Identity.GetTenantId();
        var userId = User.Identity.GetUserId();

        if (model == null)
            return BadRequest(new { success = false, message = "Incoming request is not valid." });

        if (string.IsNullOrEmpty(model.staffname) || string.IsNullOrEmpty(model.staffemail))
            return BadRequest(new { success = false, message = "Invalid staff details." });

        if (tenantId == Guid.Empty)
            return BadRequest(new { success = false, message = "Tenant context not found." });

        var staffExist = _tenantRepository.IsStaffExist(tenantId, model.staffemail);
        if (staffExist)
        {
            return BadRequest(new { success = false, message = "Staff already exists with this email for this tenant." });
        }

        Staff staff = new Staff()
        {
            tenantid = tenantId,
            departmentid = model.departmentid,
            staffname = model.staffname,
            staffemail = model.staffemail,
            staffphone = model.staffphone ?? "",
            address = model.address,
            staffpassword = model.staffpassword ?? "DefaultPassword123!", // TODO: Handle password security properly
            createdby = User.Identity.GetUserId(),
            createddate = DateTime.UtcNow
        };

        var result = await _tenantRepository.CreateStaffAsync(staff);
        return result.HandleServiceResponse();
    }

    [HttpGet]
    public async Task<IActionResult> EditStaff(Guid? staffid)
    {
        if (staffid == null)
            return BadRequest(new { success = false, message = "Staff ID is required." });

        var staffVm = await _tenantRepository.GetStaffById(staffid.Value);
        if (staffVm == null)
            return NotFound(new { success = false, message = "Staff not found." });

        return Ok(new { success = true, data = staffVm });
    }

    [HttpPost]
    public async Task<IActionResult> UpdateStaff([FromBody] CreateStaffVm model)
    {
        if (model == null || model.staffid == null)
            return BadRequest(new { success = false, message = "Invalid update request." });

        var userId = User.Identity.GetUserId();
        var result = await _tenantRepository.UpdateStaffAsync(model, userId);

        return result.HandleServiceResponse();
    }

    [HttpGet]
    public async Task<IActionResult> GetStaffList()
    {
        var tenantId = User.Identity.GetTenantId();
        if (tenantId == Guid.Empty)
            return BadRequest(new { success = false, message = "Tenant context not found." });

        var result = await _tenantRepository.GetStaffListAsync(tenantId);
        return result.HandleServiceResponse();
    }

    [HttpGet]
    public async Task<IActionResult> GetStaffDropdown()
    {
        var result = await _tenantRepository.GetStaffDropdown(User.Identity.GetTenantId());

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