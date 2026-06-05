using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class ProgramMasterDto
    {
        public int Id { get; set; }

        public int DegreeId { get; set; }
        public string?  DegreeName { get; set; }

        public string? Name { get; set; }

        public string? Code { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }
    }
}
