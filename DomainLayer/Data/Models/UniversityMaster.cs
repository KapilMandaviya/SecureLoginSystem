using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class UniversityMaster
{
    public int Id { get; set; }

    public string UniName { get; set; } = null!;

    public string StateName { get; set; } = null!;

    public string Code { get; set; } = null!;

    public string? Email { get; set; }

    public string? Mobile { get; set; }

    public string? Status { get; set; }

    public string? LogoFile { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }

    public bool? IsActive { get; set; }
}
