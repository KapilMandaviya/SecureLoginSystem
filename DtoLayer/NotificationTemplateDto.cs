using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class NotificationTemplateDto
    {
        public int Id { get; set; }

        public string EventCode { get; set; } = null!;

        public string EventName { get; set; } = null!;

        public string Channel { get; set; } = null!;

        public string? Subject { get; set; }

        public string Body { get; set; } = null!;

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

    }
}
