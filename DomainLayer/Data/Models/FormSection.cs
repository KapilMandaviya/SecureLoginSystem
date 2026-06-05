using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class FormSection
{
    public int Id { get; set; }

    public bool PersonalDetails { get; set; }

    public bool AcademicDetails { get; set; }

    public bool AddressSection { get; set; }

    public bool EligibilityCriteria { get; set; }

    public bool DocumentUpload { get; set; }

    public bool ChoiceFilling { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
