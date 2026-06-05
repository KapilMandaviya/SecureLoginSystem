using BusinessLogic.BS_MasterRepo.Interface;
using DtoLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SecureLoginRBAC.Controllers.Masters
{
    public class CategoryController(IBS_CategoryMasterRepo _service) : Controller
    {
        [Authorize(Policy = "Admission_CategoryMaster_VIEW")]
        public IActionResult CategoryView()
        {
            return View();
        }
       

        // Get all universities
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.fetchAllAsync();

            return Ok(new
            {
                data = data,
                canEdit = User.HasClaim("permission", "Admission_CategoryMaster_UPDATE"),
                canDelete = User.HasClaim("permission", "Admission_CategoryMaster_DELETE")
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
        [Authorize(Policy = "Admission_CategoryMaster_CREATE")]
        public async Task<IActionResult> saveCategoryDetail([FromBody] CategoryMasterDto dto)
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
        [Authorize(Policy = "Admission_CategoryMaster_UPDATE")]
        public async Task<IActionResult> updateCategoryDetail([FromBody] CategoryMasterDto dto)
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
        [Authorize(Policy = "Admission_CategoryMaster_DELETE")]
        public async Task<IActionResult> deleteProgram(int id)
        {
            var (result, message) = await _service.deleteProgram(id);
            if (result) return Ok(new { success = true, message });
            return Json(new { success = false, message });
        }
    }
}
