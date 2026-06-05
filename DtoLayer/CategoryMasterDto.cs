using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class CategoryMasterDto
    {

        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Code { get; set; } = null!;

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }
    }
}
