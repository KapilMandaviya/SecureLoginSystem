using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class UserLoginOtp
{
    public int Id { get; set; }

    public int? EmpId { get; set; }

    public string? Email { get; set; }

    public string? Mobile { get; set; }

    public string OtpType { get; set; } = null!;

    public string OtpHash { get; set; } = null!;

    public DateTime ExpiryTime { get; set; }

    public bool IsUsed { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UsedAt { get; set; }
}
