using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class ModuleMaster
{
    public int Id { get; set; }

    public string ModuleName { get; set; } = null!;

    public string ModuleCode { get; set; } = null!;

    public string? ModuleIcon { get; set; }

    public int MenuOrder { get; set; }

    public string? ControllerName { get; set; }

    public string? ActionName { get; set; }

    public int? ParentId { get; set; }

    public bool IsMenu { get; set; }

    public bool IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
