using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class Registration
{
    public int EmpId { get; set; }

    public string? EmpName { get; set; }

    public string? Address { get; set; }

    public int? CityId { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Pincode { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? Mobile { get; set; }

    public string? Birthdate { get; set; }

    public string? IpAddress { get; set; }

    public string? InsertDate { get; set; }

    public string? UpdateDate { get; set; }

    public string? DeleteDate { get; set; }

    public string? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public string? IsActiveRemark { get; set; }

    public int? UId { get; set; }

    public int? RoleId { get; set; }

    public int? FcId { get; set; }

    public int? CollegeId { get; set; }

    public int? DesigId { get; set; }

    public string? EmpCode { get; set; }

    public string? Note { get; set; }

    public string? FormName { get; set; }

    public int? PrimaryEmpId { get; set; }

    public string? EmpStatus { get; set; }

    public int? MergeStatus { get; set; }

    public string? DisciId { get; set; }
}
