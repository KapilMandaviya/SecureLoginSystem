using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class AdmissionAcademicYearDto
    {
        public int Id { get; set; }

        public string? UniversityId { get; set; }
        public string? UniversityName { get; set; }

        public int? DegreeId { get; set; }

        public string? degreeName { get; set; }

        public int? AcademicYearId { get; set; }

        public string AcademicYear { get; set; }

        public DateOnly? AcademicStartDate { get; set; }

        public DateOnly AcademicEndDate { get; set; }

        public bool IsEnabled { get; set; }

        public string? NewsNotice { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }


        public List<AdmissionRoundDto>? AdmissionRounds { get; set; }
    }

    public class AdmissionRoundDto
    {
        public int Id { get; set; }

        public int? AdmissionAcademicYearId { get; set; }

        public int? AcademicYearId { get; set; }

        public string? RoundName { get; set; }

        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        public string AdmissionStatus { get; set; } = null!;

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }
    }
}
