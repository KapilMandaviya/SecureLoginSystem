using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class RegistrationDto
    {
        public int? EmpId { get; set; }

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

    public class RegistrationVerificationDto
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

    }
}

