using BusinessLogic.BS_EmailCommonRepo.Interface;
using BusinessLogic.BS_SuperAdminRepo.Interface;
using DtoLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO.Pipelines;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SecureLoginRBAC.Controllers.SuperAdmin
{

    [Authorize]
    public class AuthPasswordSettingController : Controller
    {
        private readonly IBS_SAAuthSetting _SAAuthSetting;
        private readonly IBS_EmailConfig  _emailConfig;
        public AuthPasswordSettingController(IBS_SAAuthSetting bS_SAAuth,IBS_EmailConfig emailConfig)
        {
            _SAAuthSetting = bS_SAAuth;
            _emailConfig = emailConfig;
        }

        [Authorize(Policy = "Admission_AuthenticationSetting_VIEW")]
        public IActionResult AuthenticationSetting()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetAuthenticationSettings()
        {
            var settings = new List<AuthenticationSettingDto>();
            settings = await _SAAuthSetting.fetchAllAsync();
            return Json(settings);
        }

        [HttpGet]
        public async Task<IActionResult> GetPasswordRules()
        {
            var rules = new List<PasswordRuleSettingDto>();
            rules = await _SAAuthSetting.fetchAllPasswordRulesAsync();
            return Json(rules);

        }


        [HttpPost]
        [Authorize(Policy = "Admission_AuthenticationSetting_CREATE")]
        public async Task<IActionResult> SaveAuthenticationSettings(
    [FromBody] List<AuthenticationSettingDto> settings)
        {
            if (settings == null || !settings.Any())
                return Json(new
                {
                    result = false,
                    message = "Invalid data"
                });

            var repoResult = await _SAAuthSetting.SaveOrUpdateAsync(settings);


            return Json(new
            {
                result = repoResult.result,
                message = repoResult.message
            });
        }

        [HttpPost]
        [Authorize(Policy = "Admission_AuthenticationSetting_UPDATE")]
        public async Task<IActionResult> UpdateAuthenticationSettings(
    [FromBody] List<AuthenticationSettingDto> settings)
        {
            if (settings == null || !settings.Any())
                return Json(new
                {
                    result = false,
                    message = "Invalid data"
                });

            var repoResult = await _SAAuthSetting.SaveOrUpdateAsync(settings);


            return Json(new
            {
                result = repoResult.result,
                message = repoResult.message
            });
        }


        [HttpPost]
        [Authorize(Policy = "Admission_AuthenticationSetting_UPDATE")]
        public async Task<IActionResult> UpdatePasswordRule([FromBody] List<PasswordRuleSettingDto> settings)
        {
            if (settings == null || !settings.Any())
                return Json(new
                {
                    result = false,
                    message = "Invalid data"
                });

            var repoResult = await _SAAuthSetting.SaveOrUpdatePasswordRulesAsync(settings);


            return Json(new
            {
                result = repoResult.result,
                message = repoResult.message
            });
        }

        [HttpPost]
        [Authorize(Policy = "Admission_AuthenticationSetting_CREATE")]
        public async Task<IActionResult> SaveEmailConfig([FromBody] EmailMasterDto settings)
        {
            if (settings == null)
                return Json(new
                {
                    result = false,
                    message = "Invalid data"
                });

            var repoResult = await _emailConfig.SaveOrUpdateEmailConfigAsync(settings);


            return Json(new
            {
                result = repoResult.result,
                message = repoResult.message
            });
        }


        [HttpPost]
        [Authorize(Policy = "Admission_AuthenticationSetting_UPDATE")]
        public async Task<IActionResult> updateEmailConfig([FromBody] EmailMasterDto settings)
        {
            if (settings == null)
                return Json(new
                {
                    result = false,
                    message = "Invalid data"
                });

            var repoResult = await _emailConfig.SaveOrUpdateEmailConfigAsync(settings);


            return Json(new
            {
                result = repoResult.result,
                message = repoResult.message
            });
        }


        [HttpGet]
        public async Task<IActionResult> getEmaiConfig()
        {
            var settings = new EmailMasterDto();
            settings = await _emailConfig.GetEmailConfigValueAsync();
            return Json(settings);
        }
    }
}
