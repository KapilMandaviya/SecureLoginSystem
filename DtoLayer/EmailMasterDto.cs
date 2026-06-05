using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class EmailMasterDto
    {
        public int EmailId { get; set; }

        public string? Email { get; set; }

        public string? AppPassword { get; set; }

        public int? SmtpPort { get; set; }

        public string? SmtpServer { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdateDate { get; set; }

        public string? LastModify { get; set; }

        public DateTime? DeletedDate { get; set; }
    }
}
