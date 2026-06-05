using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_EmailCommonRepo.Interface
{
    public interface IBS_EmailConfig
    {
        Task<EmailMasterDto> GetEmailConfigValueAsync();
        Task<(bool result, string message)> SaveOrUpdateEmailConfigAsync(EmailMasterDto settings);
    }
}
