using System;
using Microsoft.AspNetCore.Identity;

namespace BackendApi.Api.Entity
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public Guid? tenantid { get; set; }
    }
}
