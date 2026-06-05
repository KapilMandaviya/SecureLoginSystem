using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class PaymentSetting
{
    public int Id { get; set; }

    public string PaymentTiming { get; set; } = null!;

    public decimal? ApplicationFee { get; set; }

    public int RetryAttempts { get; set; }

    public bool RefundableFee { get; set; }

    public bool TestMode { get; set; }

    public string GatewayProvider { get; set; } = null!;

    public string? MerchantKey { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
