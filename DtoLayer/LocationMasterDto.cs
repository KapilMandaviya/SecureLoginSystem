using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class Country
    {
        public int Id { get; set; }

        public string CountryName { get; set; } = null!;

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public List<State>? States { get; set; }

    }


    public class State
    {
        public int Id { get; set; }

        public string StateName { get; set; } = null!;

        public int CountryId { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public List<CityDto>? Cities { get; set; } 
    }


    public class CityDto
    {
        public int CityId { get; set; }

        public string CityName { get; set; } = null!;

        public int StateId { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }
    }

}
