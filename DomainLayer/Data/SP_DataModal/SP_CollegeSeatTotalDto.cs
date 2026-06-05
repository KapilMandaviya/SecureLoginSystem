using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Data.SP_DataModal
{
    public class SP_CollegeSeatTotalDto
    {
        public int collegeId { get; set; }

        public string? universityName { get; set; }


        public int? programId { get; set; }
        public int? quotaId { get; set; }


        public int? CSTId { get; set; }
       

        public string? CollegeName { get; set; }
        public string? ProgramName { get; set; }
        public string? AcademicYear { get; set; }
        public string? QuotaName { get; set; }
        public int? TotalSeat { get; set; }
        public string? City { get; set; }
    }
}
