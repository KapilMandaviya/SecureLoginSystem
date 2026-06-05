using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class DegreeMasterDto
    {
        public int DegreeId { get; set; }

        public string? Degree { get; set; }

        public string? DegreeCode { get; set; }

        public string? DegreeType { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }
    }

    public class DegreeUniversityMappingDto
    {

        public int Id { get; set; }

        public int AcademicYearId { get; set; }

        public int UniversityId { get; set; }

        public string? DegreeId { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }
    }
}
