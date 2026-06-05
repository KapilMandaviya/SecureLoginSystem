using BusinessLogic.BS_MasterRepo.Interface;
using DtoLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SecureLoginRBAC.Controllers.Masters
{
    [Authorize]
    public class AcadamicYearController : Controller
    {
        private readonly IBS_AcademicYearRepo _service;
        public AcadamicYearController(IBS_AcademicYearRepo yearRepo)
        {
            _service = yearRepo;
        }

        [Authorize(Policy = "Admission_AcademicYear_VIEW")]
        public IActionResult AcadamicView()
        {
            return View();
        }

        // Get all universities
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.fetchAllAsync();
            data = data.OrderBy(x => x.StatusAc==false).ToList();
            return Ok(new
            {
                data = data,
                canEdit = User.HasClaim("permission", "Admission_AcademicYear_UPDATE"),
                canMakeActive = User.HasClaim("permission", "Admission_AcademicYear_MAKEACTIVE")
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
        [Authorize(Policy = "Admission_AcademicYear_CREATE")]
        public async Task<IActionResult> saveAcademicDetail([FromBody] AcadamicYearDto dto)
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
        [Authorize(Policy = "Admission_AcademicYear_UPDATE")]
        public async Task<IActionResult> updateAcademicDetail([FromBody] AcadamicYearDto dto)
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
        [Authorize(Policy = "Admission_AcademicYear_MAKEACTIVE")]
        public async Task<IActionResult> MakeActive(int id)
        {
            var (result, message) = await _service.makeActiveYear(id);
            if (result) return Ok(new { success = true, message });
            return Json(new { success = false, message });
        }

           

    }
}
