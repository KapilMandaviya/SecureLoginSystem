using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class RoleFormsPermission
{
    public int Id { get; set; }

    public int RoleId { get; set; }

    public int? ModuleId { get; set; }

    public int? FormId { get; set; }

    public int? ActionId { get; set; }

    public string? PermissionKey { get; set; }

    public bool? CanView { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
