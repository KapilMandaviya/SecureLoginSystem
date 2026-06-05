using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.EmailCommonRepo.Interface
{
    public interface IEmailConfigRepo
    {
        Task<EmailMasterDto> GetEmailConfigValueAsync();
        Task<(bool result, string message)> SaveOrUpdateEmailConfigAsync(EmailMasterDto settings);
    }
}
