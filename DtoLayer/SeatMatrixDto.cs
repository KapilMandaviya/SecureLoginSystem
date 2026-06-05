using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class SeatMatrixDto
    {
        public int Id { get; set; }

        public int AcademicYear { get; set; }

        public int CollegeId { get; set; }

        public int ProgramId { get; set; }

        public int QuotaId { get; set; }

        public int CategoryId { get; set; }

        public string? CatCode { get; set; }

        public int Seat { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

       
    }
}
