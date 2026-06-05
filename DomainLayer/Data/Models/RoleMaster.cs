using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class RoleMaster
{
    public int Id { get; set; }

    public string RoleName { get; set; } = null!;

    public int PriorityOrder { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
