using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Api.Entity
{
    public class MaritalStatus
    {
        [Key]
        public Guid maritalstatusid { get; set; }

        public Guid tenantid { get; set; }

        [StringLength(50)]
        public string name { get; set; } = null!;

        public string? description { get; set; }

        public bool inactive { get; set; }

        public DateTime createddate { get; set; } = DateTime.Now;

        [StringLength(128)]
        public string? createdby { get; set; }

        public DateTime? updateddate { get; set; }

        [StringLength(128)]
        public string? updatedby { get; set; }

    }
}