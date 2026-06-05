using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class UserPermissionDto
    {

      
        public string FormCode { get; set; }
        public string ActionName { get; set; }   // CREATE / UPDATE / CUSTOM_ACTION
        public string PermissionKey { get; set; }
    }

    public class FormPermissionDto
    {
        public string FormCode { get; set; }
        public Dictionary<string, string> Permissions { get; set; } = new();


    }




}
