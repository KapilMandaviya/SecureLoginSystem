using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Data.SP_DataModal
{
    public class SP_CollegeMasterDto
    {
        // CollegeSeatTotal
        public int CSTId { get; set; }
        public int CollegeId { get; set; }
        public int ProgramId { get; set; }
        public int QuotaId { get; set; }
        public int AcademicYear { get; set; }
        public int TotalSeat { get; set; }

        // College
        public string? CollegeCode { get; set; }
        public string? CollegeName { get; set; }
        public string? CollegeAliasName { get; set; }
        public string? Address { get; set; }
        public int? CityId { get; set; }
        public string? Pincode { get; set; }
        public string? StdCode { get; set; }
        public string? LandlineNo1 { get; set; }
        public string? LandlineNo2 { get; set; }
        public string? MobileNo { get; set; }
        public string? FaxNo { get; set; }
        public string? Email { get; set; }
        public string? WebUrl { get; set; }

        // SeatMatrix
        public int SeatMatrixId { get; set; }
        public int CategoryId { get; set; }
        public string? CatCode { get; set; }
        public int Seat { get; set; }

    }
}
