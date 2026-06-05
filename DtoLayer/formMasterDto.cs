using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class formMasterDto
    {
        public int Id { get; set; }

        public int? ModuleId { get; set; }

        public string FormName { get; set; } = null!;

        public string? FormCode { get; set; }

        public string? moduleName{ get; set; }

        public string? FormIcon { get; set; }

        public int? MenuOrder { get; set; }

        public string? ControllerName { get; set; }

        public string? ActionName { get; set; }

        public int? ParentId { get; set; }

        public bool IsMenu { get; set; }

        public string? ActionList { get; set; }
        public bool IsActive { get; set; }

        public string? MenuType { get; set; }
        public string? LastModify { get; set; }
        public int? CreatedBy { get; set; }

        public List<ActionMasterDto> actionPayLoad { get; set; } = new();

    }

    public class MenuOrderDto
    {
        public int? formId { get; set; }
        public int ParentId { get; set; }

        public string formName { get; set; }
        public int MenuOrder { get; set; }
        public int? createdBy { get; set; }

    }

    //public class ActionPayLoad
    //{
    //    public List<ActionMasterDto> Existing { get; set; } = new();
    //    public List<ActionMasterDto> NewlyAdded { get; set; } = new();
    //}
}
