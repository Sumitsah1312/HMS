using Microsoft.AspNetCore.Mvc.Rendering;

namespace BackendApi.Api.Models
{
    public enum EnumModelRole
    {
        superadmin,
        tenant,
        doctor,
        patient
    }
}