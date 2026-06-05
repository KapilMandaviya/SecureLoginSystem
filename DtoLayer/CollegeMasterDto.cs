using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class CollegeMasterDto
    {
        public int CollegeId { get; set; }

        public int UniversityId { get; set; }

        public string? CollegeCode { get; set; }

        public string? Name { get; set; }

        public string? CollegeAliasName { get; set; }

        public string? Address { get; set; }

        public int? CityId { get; set; }

        public string? cityName { get; set; }

        public string? Pincode { get; set; }

        public string? StdCode { get; set; }

        public string? LandlineNo1 { get; set; }

        public string? LandlineNo2 { get; set; }

        public string? MobileNo { get; set; }

        public string? FaxNo { get; set; }

        public string? Email { get; set; }

        public string? WebUrl { get; set; }

        public int? AcademicYear { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }



        public List<SeatMatrixDto>? seatMatrixDtos { get; set; }  

        public List<CollegeSeatTotalDto>? CollegeSeatTotal { get; set; }


    }

    public class DatatableCollegeSeatTotalDto
    {
        public int? collegeId { get; set; }

        public string? universityName { get; set; }

        public int? CSTId { get; set; }

        public int? programId { get; set; }
        public int? quotaId { get; set; }

        public string? CollegeName { get; set; }
        public string? ProgramName { get; set; }
        public string? AcademicYear { get; set; }
        public string? QuotaName { get; set; }
        public int? TotalSeat { get; set; }
        public string? City { get; set; }
    }

    public class CollegeSeatTotalDto
    {
        public int Id { get; set; }

        public int CollegeId { get; set; }

        public int ProgramId { get; set; }

        public int QuotaId { get; set; }
        public int? AcademicYear { get; set; }

        public int TotalSeat { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }


    }
}
