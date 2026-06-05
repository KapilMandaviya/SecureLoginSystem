using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class RegistrationVerificationSetting
{
    public int Id { get; set; }

    public bool MobileOtpRequired { get; set; }

    public bool EmailOtpRequired { get; set; }

    public bool AutoExpireEnabled { get; set; }

    public int? MobileOtpAttempts { get; set; }

    public int? MobileOtpReset { get; set; }

    public int? MobileOtpExpiration { get; set; }

    public int? EmailOtpAttempts { get; set; }

    public int? EmailOtpReset { get; set; }

    public int? EmailOtpExpiration { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
