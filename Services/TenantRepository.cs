using Microsoft.EntityFrameworkCore;
using BackendApi.Api.Data;
using BackendApi.Api.Interfaces;
using BackendApi.Api.Models;
using BackendApi.Api.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace BackendApi.Api.Services
{
    public class TenantRepository(
        DefaultDbContext _ctx,UserManager<ApplicationUser> _userManager,
        RoleManager<IdentityRole<Guid>> _roleManager) : ITenantRepository
    {
        public async Task<TenantDashboardDataResponseModel> GetTenantDashboardData(Guid tenantid)
        {
            if( tenantid == Guid.Empty)
            {
                return new TenantDashboardDataResponseModel
                {
                    Success = false,
                    Message = "Invalid tenant ID."
                };
            }
            var result = new TenantDashboardDataResponseModel();
            try
            {
                var dashboardData = new TenantDashboardDataVm
                {
                    tenantid=tenantid,
                    TotalActiveDoctorCount = await _ctx.Staff.CountAsync(t => !t.inactive && t.tenantid==tenantid),
                    TotalPatientCount = 0,
                    PendingQueue = 0,
                    NewPatient = 0
                };

                result.data = dashboardData;
                result.Success = true;
                result.Message = "Tenant dashboard data fetched successfully.";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error fetching SuperAdmin dashboard data: {ex.Message}";
            }
            return result;
        }

        public async Task<Tenant?> GetTenantsAsync(Guid tenantid)
        {
            return await _ctx.Tenant.Where(m => m.tenantid == tenantid).FirstOrDefaultAsync();
        }

        public async Task<ResponseModel> CreateDepartmentAsync(Departments department)
        {
            var result = new ResponseModel();
            try
            {
                await _ctx.Departments.AddAsync(department);
                await _ctx.SaveChangesAsync();
                result.Success = true;
                result.Message = "Department created successfully.";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error creating department: {ex.Message}";
            }
            return result;
        }

        public async Task<DepartmentResponseModel> GetDepartmentListAsync(Guid tenantId)
        {
            var result = new DepartmentResponseModel();
            try
            {
                var list = await _ctx.Departments
                    .Where(d => d.tenantid == tenantId)
                    .Select(d => new CreateDepartmentVm
                    {
                        departmentid = d.departmentid,
                        tenantid = d.tenantid.ToString(),
                        name = d.name,
                        description = d.description,
                        headid = d.headid,
                        inactive = d.inactive
                    }).ToListAsync();

                result.Success = true;
                result.data = list;
                result.Message = "Departments fetched successfully.";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error fetching departments: {ex.Message}";
            }
            return result;
        }

        public async Task<CreateDepartmentVm?> GetDeptModelById(Guid? departmentid)
        {
            if (departmentid == null) return null;

            return await _ctx.Departments
                .Where(d => d.departmentid == departmentid)
                .Select(d => new CreateDepartmentVm
                {
                    departmentid = d.departmentid,
                    tenantid = d.tenantid.ToString(),
                    name = d.name,
                    description = d.description,
                    headid = d.headid,
                    inactive = d.inactive
                }).FirstOrDefaultAsync();
        }

        public async Task<ResponseModel> UpdateDepartmentAsync(CreateDepartmentVm model, string userId)
        {
            var result = new ResponseModel();
            try
            {
                var dept = await _ctx.Departments.FirstOrDefaultAsync(d => d.departmentid == model.departmentid);
                if (dept == null)
                {
                    result.Success = false;
                    result.Message = "Department not found.";
                    return result;
                }

                dept.name = model.name ?? dept.name;
                dept.description = model.description ?? dept.description;
                dept.headid = model.headid ?? dept.headid;
                dept.inactive = model.inactive;
                dept.updatedby = userId;
                dept.updateddate = DateTime.UtcNow;

                _ctx.Departments.Update(dept);
                await _ctx.SaveChangesAsync();

                result.Success = true;
                result.Message = "Department updated successfully.";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error updating department: {ex.Message}";
            }
            return result;
        }

        public bool IsDepartmentExist(Guid tenantId, string name)
        {
            return _ctx.Departments.Any(d => d.tenantid == tenantId && d.name.ToLower() == name.ToLower() && !d.inactive);
        }
        public async Task<DDResponseModel> GetDepartmentDropdown(Guid? tenantid)
        {
            var result = new DDResponseModel();
            if (tenantid == null)
            {
                result.Success = false;
                result.Message = "Invalid tenant.";
                return result;
            }
            var dts = await _ctx.Departments.Where(m => m.tenantid == tenantid && !m.inactive).ToListAsync();

            if (dts == null || dts.Count == 0)
            {
                result.Success = false;
                result.Message = "No departments found for this tenant.";
                return result;
            }

            var list = new List<SelectListItem>();
            foreach (var r in dts)
            {
                list.Add(new SelectListItem()
                {
                    Text = r.name,
                    Value = r.departmentid.ToString()
                });
            }
            result.Success = true;
            result.data = list;
            return result;
        }
        public async Task<DDResponseModel> GetMaritalStatusDropdown(Guid? tenantid)
        {
            var result = new DDResponseModel();
            if (tenantid == null)
            {
                result.Success = false;
                result.Message = "Invalid tenant.";
                return result;
            }
            var dts = await _ctx.MaritalStatus.Where(m => m.tenantid == tenantid && !m.inactive).ToListAsync();

            if (dts == null || dts.Count == 0)
            {
                result.Success = false;
                result.Message = "No departments found for this tenant.";
                return result;
            }

            var list = new List<SelectListItem>();
            foreach (var r in dts)
            {
                list.Add(new SelectListItem()
                {
                    Text = r.name,
                    Value = r.maritalstatusid.ToString()
                });
            }
            result.Success = true;
            result.data = list;
            return result;
        }

        public async Task<ResponseModel> CreateStaffAsync(Staff staff)
        {
            var result = new ResponseModel();
            using var transaction = await _ctx.Database.BeginTransactionAsync();
            try
            {
                await _ctx.Staff.AddAsync(staff);
                await _ctx.SaveChangesAsync();

                 var user = new ApplicationUser
                {
                    UserName = staff.staffemail,
                    Email = staff.staffemail,
                    PhoneNumber = staff.staffphone,
                    tenantid = staff.tenantid
                };
                var createResult = await _userManager.CreateAsync(user, staff.staffpassword);
                if (!createResult.Succeeded)
                {
                    result.Success = false;
                    result.Message = string.Join(", ", createResult.Errors.Select(e => e.Description));
                    return result;
                
                }
                 // Assign Tenant Role
                if (!await _roleManager.RoleExistsAsync(EnumModelRole.doctor.ToString()))
                {
                    await _roleManager.CreateAsync(new IdentityRole<Guid> { Name = EnumModelRole.doctor.ToString() });
                }
                await _userManager.AddToRoleAsync(user, EnumModelRole.doctor.ToString());

                // Create Tenant Record

                await transaction.CommitAsync();

                result.Success = true;
                result.Message = "Staff created successfully.";
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                result.Success = false;
                result.Message = $"Error creating staff: {ex.Message}";
            }
            return result;
        }

        public async Task<StaffResponseModel> GetStaffListAsync(Guid tenantId)
        {
            var result = new StaffResponseModel();
            try
            {
                var list = await _ctx.Staff
                    .Where(s => s.tenantid == tenantId && !s.inactive)
                    .Select(s => new CreateStaffVm
                    {
                        staffid = s.staffid,
                        tenantid = s.tenantid.ToString(),
                        departmentid = s.departmentid,
                        staffname = s.staffname,
                        staffemail = s.staffemail,
                        staffphone = s.staffphone,
                        address = s.address,
                        // staffpassword is usually not returned for security, but keeping symmetric if needed or omitted
                        inactive = s.inactive
                    }).ToListAsync();

                result.Success = true;
                result.data = list;
                result.Message = "Staff fetched successfully.";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error fetching staff: {ex.Message}";
            }
            return result;
        }

        public async Task<CreateStaffVm?> GetStaffById(Guid staffId)
        {
            return await _ctx.Staff
                .Where(s => s.staffid == staffId)
                .Select(s => new CreateStaffVm
                {
                    staffid = s.staffid,
                    tenantid = s.tenantid.ToString(),
                    departmentid = s.departmentid,
                    staffname = s.staffname,
                    staffemail = s.staffemail,
                    staffphone = s.staffphone,
                    address = s.address,
                    inactive = s.inactive
                }).FirstOrDefaultAsync();
        }

        public async Task<ResponseModel> UpdateStaffAsync(CreateStaffVm model, string userId)
        {
            var result = new ResponseModel();
            try
            {
                var staff = await _ctx.Staff.FirstOrDefaultAsync(s => s.staffid == model.staffid);
                if (staff == null)
                {
                    result.Success = false;
                    result.Message = "Staff not found.";
                    return result;
                }

                staff.departmentid = model.departmentid;
                staff.staffname = model.staffname ?? staff.staffname;
                staff.staffemail = model.staffemail ?? staff.staffemail;
                staff.staffphone = model.staffphone ?? staff.staffphone;
                staff.address = model.address ?? staff.address;
                staff.inactive = model.inactive;
                staff.updatedby = userId;
                staff.updateddate = DateTime.UtcNow;

                _ctx.Staff.Update(staff);
                await _ctx.SaveChangesAsync();

                result.Success = true;
                result.Message = "Staff updated successfully.";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error updating staff: {ex.Message}";
            }
            return result;
        }

        public bool IsStaffExist(Guid tenantId, string email)
        {
            return _ctx.Staff.Any(s => s.tenantid == tenantId && s.staffemail.ToLower() == email.ToLower() && !s.inactive);
        }

        public async Task<DDResponseModel> GetStaffDropdown(Guid? tenantid)
        {
            var result = new DDResponseModel();
            if (tenantid == null)
            {
                result.Success = false;
                result.Message = "Invalid tenant.";
                return result;
            }
            var staffList = await _ctx.Staff.Where(s => s.tenantid == tenantid && !s.inactive).ToListAsync();

            if (staffList == null || staffList.Count == 0)
            {
                result.Success = false;
                result.Message = "No staff found for this tenant.";
                return result;
            }

            var list = new List<SelectListItem>();
            foreach (var s in staffList)
            {
                list.Add(new SelectListItem()
                {
                    Text = s.staffname,
                    Value = s.staffid.ToString()
                });
            }
            result.Success = true;
            result.data = list;
            return result;
        }
    }
}
