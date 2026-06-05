using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class CollegeMaster
{
    public int CollegeId { get; set; }

    public int UniversityId { get; set; }

    public string? CollegeCode { get; set; }

    public string? Name { get; set; }

    public string? CollegeAliasName { get; set; }

    public string? Address { get; set; }

    public int? CityId { get; set; }

    public string? Pincode { get; set; }

    public string? StdCode { get; set; }

    public string? LandlineNo1 { get; set; }

    public string? LandlineNo2 { get; set; }

    public string? MobileNo { get; set; }

    public string? FaxNo { get; set; }

    public string? Email { get; set; }

    public string? WebUrl { get; set; }

    public int? AcademicYear { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
