using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class RoleMasterDto
    {
        public int id { get; set; }

        public string roleName { get; set; } = string.Empty;

        public int rolePriority { get; set; }

        public bool isActive { get; set; }

        public int? createdBy { get; set; }

        //public List<ActionMasterDto> actionMasterDtos { get;set; }
        public List<formRolePermissionDto>? formRolePermissions { get; set; }

        public int? ModuleId { get; set; }
    }

    public class formRolePermissionDto
    {
        public int Id { get; set; }

        public int RoleId { get; set; }

        public int? ModuleId { get; set; }

        public int? FormId { get; set; }

        public int? ActionId { get; set; }

        public string? PermissionKey { get; set; }

        public bool? CanView { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }


    }
}
