using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class DegreeUniversityMapping
{
    public int Id { get; set; }

    public int AcademicYearId { get; set; }

    public int UniversityId { get; set; }

    public string? DegreeId { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
