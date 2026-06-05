using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class AdmissionAcademicYear
{
    public int Id { get; set; }

    public string? UniversityId { get; set; }

    public int? DegreeId { get; set; }

    public int? AcademicYearId { get; set; }

    public DateOnly? AcademicStartDate { get; set; }

    public DateOnly AcademicEndDate { get; set; }

    public bool IsEnabled { get; set; }

    public string? NewsNotice { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
