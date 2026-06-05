using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class NotificationTemplate
{
    public int Id { get; set; }

    public string EventCode { get; set; } = null!;

    public string EventName { get; set; } = null!;

    public string Channel { get; set; } = null!;

    public string? Subject { get; set; }

    public string Body { get; set; } = null!;

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
