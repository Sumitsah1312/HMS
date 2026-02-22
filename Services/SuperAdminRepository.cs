using Microsoft.EntityFrameworkCore;
using BackendApi.Api.Data;
using BackendApi.Api.Interfaces;
using BackendApi.Api.Models;
using BackendApi.Api.Entity;
using Microsoft.AspNetCore.Identity;

namespace BackendApi.Api.Services
{
    public class SuperAdminRepository(
        DefaultDbContext _ctx,
        UserManager<ApplicationUser> _userManager,
        RoleManager<IdentityRole<Guid>> _roleManager) : ISuperAdminRepository
    {
        public async Task<SuperAdminDashboardDataResponseModel> GetSuperAdminDashboardData()
        {
            var result = new SuperAdminDashboardDataResponseModel();
            try
            {
                var dashboardData = new SuperAdminDashboardDataVm
                {
                    TotalActiveTenantCount = await _ctx.Tenant.CountAsync(t => !t.inactive),
                    TotalActiveDoctorCount = 0
                };

                result.data = dashboardData;
                result.Success = true;
                result.Message = "SuperAdmin dashboard data fetched successfully.";
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error fetching SuperAdmin dashboard data: {ex.Message}";
            }
            return result;
        }

        public async Task<ResponseModel> CreateTenantAsync(CreateTenantVm model, string createdBy)
        {
            var result = new ResponseModel();
            using var transaction = await _ctx.Database.BeginTransactionAsync();
            try
            {
                var tenant = new Tenant
                {
                    tenantname = model.tenantname,
                    tenantemail = model.tenantemail,
                    tenantphone = model.tenantphone,
                    tenantpassword = model.tenantpassword, // Storing plain password as requested by schema, though discouraged
                    address = model.address,
                    networkendpoint = model.networkendpoint,
                    createdby = createdBy,
                    createddate = DateTime.UtcNow

                };

                await _ctx.Tenant.AddAsync(tenant);
                await _ctx.SaveChangesAsync();
                // Create Identity User
                // var tenantId = Guid.NewGuid();
                var user = new ApplicationUser
                {
                    UserName = model.tenantemail,
                    Email = model.tenantemail,
                    PhoneNumber = model.tenantphone,
                    tenantid = tenant.tenantid
                };

                var createResult = await _userManager.CreateAsync(user, model.tenantpassword);
                if (!createResult.Succeeded)
                {
                    result.Success = false;
                    result.Message = string.Join(", ", createResult.Errors.Select(e => e.Description));
                    return result;
                }

                // Assign Tenant Role
                if (!await _roleManager.RoleExistsAsync(EnumModelRole.tenant.ToString()))
                {
                    await _roleManager.CreateAsync(new IdentityRole<Guid> { Name = EnumModelRole.tenant.ToString() });
                }
                await _userManager.AddToRoleAsync(user, EnumModelRole.tenant.ToString());

                // Create Tenant Record

                await transaction.CommitAsync();

                result.Success = true;
                result.Message = "Tenant created successfully.";
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                result.Success = false;
                result.Message = $"Error creating tenant: {ex.Message}";
            }
            return result;
        }

        public async Task<ResponseModel> UpdateTenantAsync(UpdateTenantVm model, string updatedBy)
        {
            var result = new ResponseModel();
            try
            {
                var tenant = await _ctx.Tenant.FirstOrDefaultAsync(t => t.tenantid == model.tenantid);
                if (tenant == null)
                {
                    result.Success = false;
                    result.Message = "Tenant not found.";
                    return result;
                }

                // Update restricted fields: tenantemail, tenantphone, and tenantpassword cannot be changed
                tenant.tenantname = model.tenantname;
                tenant.address = model.address;
                tenant.networkendpoint = model.networkendpoint;
                tenant.inactive = model.inactive;
                tenant.updatedby = updatedBy;
                tenant.updateddate = DateTime.UtcNow;

                _ctx.Tenant.Update(tenant);
                await _ctx.SaveChangesAsync();

                result.Success = true;
                result.Message = "Tenant updated successfully (email, phone, and password were not changed).";
                // result.data = tenant;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error updating tenant: {ex.Message}";
            }
            return result;
        }
        public async Task<TenantListResponseModel> GetAllTenantsAsync()
        {
            var result = new TenantListResponseModel();
            try
            {
                var tenants = await _ctx.Tenant.Select(t => new CreateTenantVm
                {
                    tenantid = t.tenantid,
                    tenantname = t.tenantname,
                    tenantemail = t.tenantemail,
                    tenantphone = t.tenantphone,
                    tenantpassword = t.tenantpassword,
                    address = t.address,
                    networkendpoint = t.networkendpoint,
                    inactive = t.inactive
                }).OrderByDescending(t => t.tenantname).ToListAsync();
                result.Success = true;
                result.Message = "Tenants fetched successfully.";
                result.data = tenants;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error fetching tenants: {ex.Message}";
            }
            return result;
        }

        public async Task<TenantByIdResponseModel> GetTenantByIdAsync(Guid tenantId)
        {
            var result = new TenantByIdResponseModel();
            try
            {
                var tenant = await _ctx.Tenant.Where(t => t.tenantid == tenantId).Select(t => new CreateTenantVm
                {
                    tenantid = t.tenantid,
                    tenantname = t.tenantname,
                    tenantemail = t.tenantemail,
                    tenantphone = t.tenantphone,
                    tenantpassword = t.tenantpassword,
                    address = t.address,
                    networkendpoint = t.networkendpoint,
                    inactive = t.inactive
                }).FirstOrDefaultAsync();
                if (tenant == null)
                {
                    result.Success = false;
                    result.Message = "Tenant not found.";
                    return result;
                }

                result.Success = true;
                result.Message = "Tenant fetched successfully.";
                result.data = tenant;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Error fetching tenant: {ex.Message}";
            }
            return result;
        }
    }
}
