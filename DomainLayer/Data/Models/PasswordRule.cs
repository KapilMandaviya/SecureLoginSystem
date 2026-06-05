using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class PasswordRule
{
    public int RuleId { get; set; }

    public string RuleCode { get; set; } = null!;

    public string RuleName { get; set; } = null!;

    public bool IsEnabled { get; set; }

    public int? RuleValue { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
