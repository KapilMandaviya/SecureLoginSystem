using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class AuthenticationSettingDto
    {
        public int AuthSettingId { get; set; }

        public string? AuthCode { get; set; } 

        public string? AuthName { get; set; }  

        public bool IsEnabled { get; set; }
        public int? Otpattempt { get; set; }

        public int? OtpresetTime { get; set; }
        public int? OtpexpiryTime { get; set; }
        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdateDate { get; set; }

        public string? LastModify { get; set; }

        public DateTime? DeletedDate { get; set; }
    }

}
