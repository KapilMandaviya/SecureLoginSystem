using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class RoleMenuDto
    {
        public int MenuId { get; set; }
        public int? ParentId { get; set; }

        public int MenuOrder { get; set; }

        public string FormName { get; set; }
        public string FormCode { get; set; }
        public string FormIcon { get; set; }

        public string ControllerName { get; set; }
        public string ActionName { get; set; }

        public string MenuType { get; set; }

        public bool? CanView { get; set; }
        public bool? CanAdd { get; set; }
        public bool? CanEdit { get; set; }
        public bool? CanDelete { get; set; }

        public bool? CanPrint { get; set; }

        public bool? CanFull { get; set; }


        public List<RoleMenuDto> Children { get; set; } = new();
    }

}
