using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class PasswordRuleSettingDto
    {
        public int RuleId { get; set; }
        public string? RuleCode { get; set; } 
        public bool IsEnabled { get; set; }
        public int? RuleValue { get; set; }
        public int CreatedBy { get; set; }

    }
}
