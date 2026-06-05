using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class AcademicYear
{
    public int Id { get; set; }

    public string? StartDate { get; set; }

    public string? EndDate { get; set; }

    public string? CurrentAcYear { get; set; }

    public bool? StatusAc { get; set; }

    public bool? IsProcessed { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
