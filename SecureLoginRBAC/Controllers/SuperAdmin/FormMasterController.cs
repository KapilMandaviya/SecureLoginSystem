using BusinessLogic.BS_MasterRepo.Interface;
using BusinessLogic.BS_SuperAdminRepo.Interface;
using DtoLayer;

using UtilityLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SecureLoginRBAC.Controllers.SuperAdmin
{
    [Authorize]
    
    public class FormMasterController : Controller
    {
        private readonly IBS_FormMasterRepo _service;
        private readonly IBS_RoleMasterRepo  masterRepo;
        public FormMasterController(IBS_FormMasterRepo service,IBS_RoleMasterRepo bS_RoleMasterRepo)
        {
            _service = service;
            masterRepo = bS_RoleMasterRepo;
        }

        [Authorize(Policy = "Admission_FormMaster_VIEW")]
        public async Task<IActionResult> FormMasterScreen()
        {
            var data = await _service.getAllModuleList();

            ViewBag.Modules = data.Select(x => new SelectListItem { 
                Value=x.Id.ToString(),
                Text =x.Name
                
            }).ToList(); 

            return View();
        }
         
        // Get all universities
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.fetchAllAsync();
            data = data.OrderBy(x => x.moduleName).ToList();
            return Ok(new
            {
                data = data,
                canEdit = User.HasClaim("permission", "Admission_FormMaster_UPDATE"),
                canDelete = User.HasClaim("permission", "Admission_FormMaster_DELETE")
            });
        }

        // Get single university by Id
        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.fetchAsyncById(id);
            if (data == null) return NotFound();
            return Json(data);
        }

        // Save or update
        
        [HttpPost]
        [Authorize(Policy = "Admission_FormMaster_CREATE")]
        public async Task<IActionResult> SaveFormMasterDetails([FromBody] formMasterDto dto)
        {

            if (!ModelState.IsValid)
            {
                return Ok(new ApiResponse
                {
                    Success = false,
                    Message = "Invalid data"
                });
            }

            var response = await _service.SaveOrUpdateAsync(dto);
            return Json(response);
        }

        // Save or update
        [HttpPost]
        [Authorize(Policy = "Admission_FormMaster_UPDATE")]
        public async Task<IActionResult> updateFormMasterDetails([FromBody] formMasterDto dto)
        {

            if (!ModelState.IsValid)
            {
                return Ok(new ApiResponse
                {
                    Success = false,
                    Message = "Invalid data"
                });
            }

            var response = await _service.SaveOrUpdateAsync(dto);
            return Json(response);
        }

        // Delete by Id
        [HttpGet]
        [Authorize(Policy = "Admission_FormMaster_DELETE")]
        public async Task<IActionResult> Delete(int id)
        {
            var (result, message) = await _service.deleteUpdateAsync(id);
            if (result) return Ok(new { success = true, message });
            return Json(new { success = false, message });
        }

        // Get all universities
        public async Task<IActionResult> GetAllForms(int moduleId)
        {
            var data = await _service.fetchAllFormAsync(moduleId);
            return Json(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetMenuPriority()
        {
            var data = await _service.FetchMenuWithSubMenuAsync();
            data = data.OrderBy(x => x.ParentId).ToList();
            return Json(data);
        }

        [HttpPost]
        [Authorize(Policy = "Admission_FormMaster_UPDATE")]
        public async Task<IActionResult> SaveMenuOrder([FromBody] List<MenuOrderDto> list)
        {
            
            if (!ModelState.IsValid)
            {
                return Ok(new ApiResponse
                {
                    Success = false,
                    Message = "Invalid data"
                });
            }

            var response = await _service.SaveOrUpdateMenuOrderListAsync(list);

            if(response.Success)
            {
                var updatedMenu = await masterRepo.fetchAllRoleMenuPermissionAsync(UserContext.roleId);
                HttpContext.Session.SetString("MenuData", JsonConvert.SerializeObject(updatedMenu));

            }
            return Ok(response);

            
        }

        [HttpGet]
        public async Task<JsonResult> getAllOption()
        {
            var data = await _service.getAllOptionList();
            data = data.OrderBy(x => x.Name).ToList();
            
            return Json(new
            {
                success = true,
                data = data
            });
        }


    }
}
