using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Data.SP_DataModal
{
    public class SP_RoleMenuFieldDto
    {
        public int MenuId { get; set; }

        public string FormName { get; set; }
        public string FormCode { get; set; }
        public string FormIcon { get; set; }

        public int MenuOrder { get; set; }

        public string Controller_Name { get; set; } 
        public string ActionName { get; set; }

        public int? ParentId { get; set; }
        public string MenuType { get; set; }

        

        public int SortParentId { get; set; }
    }
}
