using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class AcadamicYearDto
    {
        public int Id { get; set; }

        public string? StartDate { get; set; }

        public string? EndDate { get; set; }

        public string? CurrentAcYear { get; set; }
        public bool? StatusAc { get; set; }

        public bool? IsProcessed { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }
    }

    public class RecieptConfigSettingDto
    {
        public long Id { get; set; }

        public long? AcademicYearId { get; set; }

        public string? UniversityLogo { get; set; }

        public string? HeaderContent { get; set; }

        public string? FooterContent { get; set; }

        public bool SendSmsPaymentConfirmation { get; set; }

        public bool SendEmailPaymentConfirmation { get; set; }

        public bool SendWhatsappPaymentConfirmation { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }
    }
}
