using BusinessLogic.BS_SuperAdminRepo.Interface;
using DtoLayer;
using RepositoryLayer.SuperAdminRepo.Interface;
using UtilityLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_SuperAdminRepo.Repository
{
    public class BS_SAAuthSetting : IBS_SAAuthSetting
    {
        private ISAAuthSetting _authSetting;
        public BS_SAAuthSetting(ISAAuthSetting sAuthSetting) {
            _authSetting = sAuthSetting;
        }
        public async Task<List<AuthenticationSettingDto>> fetchAllAsync()
        {
            return await _authSetting.fetchAllAsync();
        }

        public async Task<AuthenticationSettingDto> fetchAllAsyncByAuthCode(string? authCode)
        {
            return await _authSetting.fetchAllAsyncByAuthCode(authCode);
        }

        public async Task<List<PasswordRuleSettingDto>> fetchAllPasswordRulesAsync()
        {
            return await _authSetting.fetchAllPasswordRulesAsync();
        }

        

        public async Task<(bool result, string message)> SaveOrUpdateAsync(List<AuthenticationSettingDto> settings)
        {
            foreach (var setting in settings)
            {
                setting.CreatedBy = UserContext.EmpId;
            }

            return await _authSetting.SaveOrUpdateAsync(settings);
        }

       

        public async Task<(bool result, string message)> SaveOrUpdatePasswordRulesAsync(List<PasswordRuleSettingDto> settings)
        {
            foreach (var setting in settings)
            {
                setting.CreatedBy = UserContext.EmpId;
            }

            return await _authSetting.SaveOrUpdatePasswordRulesAsync(settings);
        }
    }
}
