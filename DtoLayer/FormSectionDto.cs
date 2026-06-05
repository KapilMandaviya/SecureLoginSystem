using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class FormSectionDto
    {
        public int Id { get; set; }

        public bool PersonalDetails { get; set; }

        public bool AcademicDetails { get; set; }

        public bool AddressSection { get; set; }

        public bool EligibilityCriteria { get; set; }

        public bool DocumentUpload { get; set; }

        public bool ChoiceFilling { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }
    }
}
