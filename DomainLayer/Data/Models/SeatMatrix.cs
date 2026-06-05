using System;
using System.Collections.Generic;

namespace DomainLayer.Data.Models;

public partial class SeatMatrix
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

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string? LastModify { get; set; }

    public DateTime? DeletedDate { get; set; }
}
