using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class PaymentSettingDto
    {
        public int Id { get; set; }

        public string PaymentTiming { get; set; } = null!;

        public decimal? ApplicationFee { get; set; }

        public int RetryAttempts { get; set; }

        public bool RefundableFee { get; set; }

        public bool TestMode { get; set; }

        public string GatewayProvider { get; set; } = null!;

        public string? MerchantKey { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }
    }
}
