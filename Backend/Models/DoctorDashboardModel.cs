using System;
using System.Collections.Generic;

namespace BackendApi.Api.Models
{
    public class DoctorDashboardStats
    {
        public int TotalPatientsToday { get; set; }
        public int PendingPatients { get; set; }
        public int CompletedPatients { get; set; }
        public int ReassignedPatients { get; set; }
    }

    public class DoctorQueueModel
    {
        public Guid VisitId { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
        public string DepartmentName { get; set; } = null!;
    }

    public class ReassignPatientModel
    {
        public Guid VisitId { get; set; }
        public Guid NewDoctorId { get; set; }
        public string NewDoctorName { get; set; } = null!;
        public Guid NewDepartmentId { get; set; }
        public string NewDepartmentName { get; set; } = null!;
        public string Reason { get; set; } = null!;
    }
}
