using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class ReceiptConfigSettingDto
    {
        public int Id { get; set; }

        public int? UniversityId { get; set; }

        public string? UniversityLogo { get; set; }

        public string? UniversityName { get; set; }   // ✅ 

        public IFormFile? UniversityLogoFile { get; set; }  // 🔥 this matches FormData key

        public string? HeaderContent { get; set; }

        public string? FooterContent { get; set; }

        public bool SendSmsPaymentConfirmation { get; set; }

        public bool SendEmailPaymentConfirmation { get; set; }

        public bool SendWhatsappPaymentConfirmation { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

    }
}
