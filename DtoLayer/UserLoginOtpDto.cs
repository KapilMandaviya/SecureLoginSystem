using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class UserLoginOtpDto
    {

        public int Id { get; set; }

        public int? EmpId { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }

        public string OtpType { get; set; } = string.Empty;
        public string OtpHash { get; set; } = string.Empty;

        public DateTime ExpiryTime { get; set; }
        public bool IsUsed { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UsedAt { get; set; }

    }

    public class VerifyOtpRequest
    {
        public string Otp { get; set; }
        public string Type { get; set; }
    }

    public class UserTwoFactorDto
    {
        public int Id { get; set; }

        public int? EmpId { get; set; }

        public string? SecretKey { get; set; } = null;

        public bool? IsEnabled { get; set; }
        public bool? IsActive { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }


    }
}
