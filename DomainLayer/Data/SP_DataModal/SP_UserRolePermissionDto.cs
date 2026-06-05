using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Data.SP_DataModal
{
    public class SP_UserRolePermissionDto
    {
        //public string FormCode { get; set; }
        //public bool CanView { get; set; }
        //public bool CanAdd { get; set; }
        //public bool CanEdit { get; set; }
        //public bool CanDelete { get; set; }
        //public bool CanPrint { get; set; }
        //public bool CanFull { get; set; }

        public string FormCode { get; set; }
        public string ActionName { get; set; }   // CREATE / UPDATE / CUSTOM_ACTION
        public string PermissionKey { get; set; }
    }

   
}
