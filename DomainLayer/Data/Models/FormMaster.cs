using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class FormMaster
{
    public int Id { get; set; }

    public int? ModuleId { get; set; }

    public string FormName { get; set; } = null!;

    public string FormCode { get; set; } = null!;

    public string? FormIcon { get; set; }

    public int MenuOrder { get; set; }

    public string? ControllerName { get; set; }

    public string? ActionName { get; set; }

    public int? ParentId { get; set; }

    public string? MenuType { get; set; }

    public bool? IsMenu { get; set; }

    public string? ActionList { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
