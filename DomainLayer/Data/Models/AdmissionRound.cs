using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class AdmissionRound
{
    public int Id { get; set; }

    public int? AdmissionAcademicYearId { get; set; }

    public int? AcademicYearId { get; set; }

    public string? RoundName { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string AdmissionStatus { get; set; } = null!;

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
