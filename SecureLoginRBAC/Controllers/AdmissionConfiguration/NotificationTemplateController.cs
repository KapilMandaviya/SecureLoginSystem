using BusinessLogic.BS_AdmissionConfiguration.Interface;
using DtoLayer;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NuGet.Configuration;

namespace SecureLoginRBAC.Controllers.AdmissionConfiguration
{

    public class NotificationTemplateController : Controller
    {
        private readonly IBS_NotificationTemplateSetting _service;
        public NotificationTemplateController(IBS_NotificationTemplateSetting template)
        {
            _service = template;
        }
        public IActionResult NotificationTemplateView()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var template = await _service.fetchAllAsync();
            return Json(new
            {
                data = template,

            });
        }

        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.getById(id);
            if (data == null) return NotFound();
            return Json(data);
        }

        [HttpPost]
        public async Task<IActionResult> SaveTemplate(
   [FromBody] NotificationTemplateDto settings)
        {
            if (settings == null)
                return Json(new
                {
                    result = false,
                    message = "Invalid data"
                });

            //var repoResult = 
            var response = await _service.SaveOrUpdateAsync(settings);
            return Json(response);


        
        }

        [HttpPost]
        public async Task<IActionResult> UpdateTemplate(
    [FromBody] NotificationTemplateDto settings)
        {
            if (settings == null)
                return Json(new
                {
                    result = false,
                    message = "Invalid data"
                });

            var repoResult = await _service.SaveOrUpdateAsync(settings);



            return Json(repoResult);
        }

        [HttpPost]
        
        public async Task<IActionResult> deleteAsync(int id)
        {
            var (result, message) = await _service.deleteAsync(id);
            if (result)
                return Ok(new { success = true, message });
            return Json(new { success = false, message });
        }

    }
}
