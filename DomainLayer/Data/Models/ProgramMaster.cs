using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class ProgramMaster
{
    public int Id { get; set; }

    public int DegreeId { get; set; }

    public string Name { get; set; } = null!;

    public string? Code { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
