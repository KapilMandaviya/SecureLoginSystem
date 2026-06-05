using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class DocumentSettingDto
    {
        public int Id { get; set; }

        public string? DocumentName { get; set; }

        public bool IsMandatory { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

    }
}
