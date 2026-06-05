using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class ReceiptConfigSetting
{
    public int Id { get; set; }

    public int? UniversityId { get; set; }

    public string? UniversityLogo { get; set; }

    public string? HeaderContent { get; set; }

    public string? FooterContent { get; set; }

    public bool SendSmsPaymentConfirmation { get; set; }

    public bool SendEmailPaymentConfirmation { get; set; }

    public bool SendWhatsappPaymentConfirmation { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
