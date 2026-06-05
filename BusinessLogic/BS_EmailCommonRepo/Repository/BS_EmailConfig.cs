using BusinessLogic.BS_EmailCommonRepo.Interface;
using DtoLayer;
using RepositoryLayer.EmailCommonRepo.Interface;
using RepositoryLayer.SuperAdminRepo.Repository;
using UtilityLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_EmailCommonRepo.Repository
{
    public class BS_EmailConfig : IBS_EmailConfig
    {
        private readonly IEmailConfigRepo _email;
        public BS_EmailConfig(IEmailConfigRepo emailConfigRepo)
        {
            _email = emailConfigRepo;
        }
        public async Task<EmailMasterDto> GetEmailConfigValueAsync()
        {
            return await _email.GetEmailConfigValueAsync();
        }
        public async Task<(bool result, string message)> SaveOrUpdateEmailConfigAsync(EmailMasterDto settings)
        {
            settings.CreatedBy = UserContext.EmpId;
            return await _email.SaveOrUpdateEmailConfigAsync(settings);
        }
    }
}
