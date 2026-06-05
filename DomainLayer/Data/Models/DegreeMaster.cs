using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class DegreeMaster
{
    public int DegreeId { get; set; }

    public string? Degree { get; set; }

    public string? DegreeCode { get; set; }

    public string? DegreeType { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
