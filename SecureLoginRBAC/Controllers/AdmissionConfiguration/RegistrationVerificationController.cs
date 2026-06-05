using BusinessLogic.BS_AdmissionConfiguration.Interface;
using DtoLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SecureLoginRBAC.Controllers.AdmissionConfiguration
{
    public class RegistrationVerificationController : Controller
    {
        private readonly IBS_RegistrationVerification _services;
        public RegistrationVerificationController(IBS_RegistrationVerification bS_Registration)
        {
            _services = bS_Registration;
        }

        //
        [Authorize(Policy = "Admission_RegistrationVerification_VIEW")]
        public IActionResult RegistrationVerificationView()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetRegistrationVerificationSettings()
        {
            
            var settings = await _services.fetchAllAsync();
            return Json(settings);
        }

        [HttpPost]

        [Authorize(Policy = "Admission_RegistrationVerification_CREATE")]
        public async Task<IActionResult> SaveRegistrationVerificationSettings(
   [FromBody] RegistrationVerificationDto settings)
        {
            if (settings == null)
                return Json(new
                {
                    result = false,
                    message = "Invalid data"
                });

            var repoResult = await _services.SaveOrUpdateAsync(settings);


            return Json(new
            {
                result = repoResult.result,
                message = repoResult.message
            });
        }

        [HttpPost]
        [Authorize(Policy = "Admission_RegistrationVerification_UPDATE")]
        public async Task<IActionResult> UpdateRegistrationVerificationSettings(
    [FromBody] RegistrationVerificationDto settings)
        {
            if (settings == null)
                return Json(new
                {
                    result = false,
                    message = "Invalid data"
                });

            var repoResult = await _services.SaveOrUpdateAsync(settings);


            return Json(new
            {
                result = repoResult.result,
                message = repoResult.message
            });
        }
    }
}
