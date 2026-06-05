using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class UserTwoFactor
{
    public int Id { get; set; }

    public int? EmpId { get; set; }

    public string? SecretKey { get; set; }

    public bool? IsEnabled { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
