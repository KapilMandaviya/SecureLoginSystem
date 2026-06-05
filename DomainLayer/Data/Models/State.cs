using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class State
{
    public int Id { get; set; }

    public string StateName { get; set; } = null!;

    public int CountryId { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }

    public virtual ICollection<City> Cities { get; set; } = new List<City>();

    public virtual Country Country { get; set; } = null!;
}
