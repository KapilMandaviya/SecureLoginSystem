using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_SuperAdminRepo.Interface
{
    public interface IBS_SAAuthSetting
    {
        Task<(bool result, string message)> SaveOrUpdateAsync(List<AuthenticationSettingDto> settings);
        Task<List<AuthenticationSettingDto>> fetchAllAsync();
        Task<AuthenticationSettingDto> fetchAllAsyncByAuthCode(string? authCode);

        Task<List<PasswordRuleSettingDto>> fetchAllPasswordRulesAsync();
        Task<(bool result, string message)> SaveOrUpdatePasswordRulesAsync(List<PasswordRuleSettingDto> settings);
        

        
    }
}
