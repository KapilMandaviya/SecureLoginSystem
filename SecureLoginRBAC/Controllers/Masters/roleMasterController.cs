using BusinessLogic.BS_MasterRepo.Interface;
using BusinessLogic.BS_SuperAdminRepo.Interface;
using DtoLayer;
using UtilityLayer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using System.Security.Claims;

namespace SecureLoginRBAC.Controllers.Masters
{
    [Authorize]
    public class roleMasterController : Controller
    {
        private readonly IBS_RoleMasterRepo masterRepo;
        private readonly IBS_FormMasterRepo _service;
        public roleMasterController(IBS_RoleMasterRepo roleMasterRepo,IBS_FormMasterRepo services)
        {
            _service = services;
            masterRepo = roleMasterRepo;
        }

        [Authorize(Policy = "Admission_RoleMaster_VIEW")]
        public async Task<IActionResult> role()
        {
            var data = await _service.getAllModuleList();

            ViewBag.ModulesList = data.Select(x => new SelectListItem
            {
                Value = x.Id.ToString(),
                Text = x.Name

            }).ToList();
            return View();
        }


        [Authorize(Policy = "Admission_RoleMaster_CREATE")]
        public async Task<IActionResult> SaveRoleDetails([FromBody] RoleMasterDto model)
        {
            if (!ModelState.IsValid)
            {
                return Ok(new ApiResponse
                {
                    Success = false,
                    Message = "Invalid data"
                });
            }

            var response = await masterRepo.SaveOrUpdateAsync(model);

            if (response.Success)
            {
                // 🔥 Refresh current logged-in user
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var roleId = int.Parse(User.FindFirstValue("roleId"));

                await RefreshCurrentUserClaims();
                var updatedMenu = await masterRepo.fetchAllRoleMenuPermissionAsync(UserContext.roleId);
                HttpContext.Session.SetString("MenuData", JsonConvert.SerializeObject(updatedMenu));

            }
            return Ok(response);
        }


        [Authorize(Policy = "Admission_RoleMaster_UPDATE")]
        public async Task<IActionResult> updateRoleDetails([FromBody] RoleMasterDto model)
        {
            if (!ModelState.IsValid)
            {
                return Ok(new ApiResponse
                {
                    Success = false,
                    Message = "Invalid data"
                });
            }

            var response = await masterRepo.SaveOrUpdateAsync(model);
            if (response.Success)
            {
                // 🔥 Refresh current logged-in user
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var roleId = int.Parse(User.FindFirstValue("roleId"));

                await RefreshCurrentUserClaims();
                var updatedMenu = await masterRepo.fetchAllRoleMenuPermissionAsync(UserContext.roleId);
                HttpContext.Session.SetString("MenuData", JsonConvert.SerializeObject(updatedMenu));


            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> checkedRoleDetails([FromBody] RoleMasterDto model)
        {
            if (!ModelState.IsValid)
            {
                return Ok(new ApiResponse
                {
                    Success = false,
                    Message = "Invalid data"
                });
            }

            var response = await masterRepo.checkRolePriority(model);
            return Ok(response);
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await masterRepo.fetchAllAsync();
            return Ok(new
            {
                data = data,
                canEdit = User.HasClaim("permission", "RoleMaster.Edit"),
                canDelete = User.HasClaim("permission", "RoleMaster.Delete")
            });

        }

        [HttpGet]
        public async Task<IActionResult> GetRoleModulePermissions(int roleId,int moduleId)
        {
            var data = await masterRepo.GetRoleWithPermissions(roleId, moduleId);
            return Json(data);
        }

        [HttpGet]
        public async Task<IActionResult> checkAssigned(int roleId)
        {
            var data = await masterRepo.IsRoleAssignedAsync(roleId);
            return Json(new { assigned = data });

        }

        // Delete by Id
        [HttpGet]
        [Authorize(Policy = "Admission_RoleMaster_DELETE")]
        public async Task<IActionResult> Delete(int roleId)
        {
            var (result, message) = await masterRepo.deleteUpdateAsync(roleId);
            if (result) return Ok(new { success = true, message });
            return Json(new { success = false, message });
        }

        [HttpGet]
        public async Task<IActionResult> GetRolePriority()
        {
            var data = await masterRepo.fetchAllAsync();
            data = data.OrderBy(x => x.rolePriority).ToList();
            return Json(data);
        }


        [HttpPost]
        [Authorize(Policy = "Admission_RoleMaster_UPDATE")]
        public async Task<IActionResult> SavePriority(
    [FromBody] List<RoleMasterDto> data)
        {
            if (!ModelState.IsValid)
            {
                return Ok(new ApiResponse
                {
                    Success = false,
                    Message = "Invalid data"
                });
            }

            var response = await masterRepo.SaveOrUpdatePriorityListAsync(data);
            return Ok(response);
        }

        private async Task RefreshCurrentUserClaims()
        {
            if (!User.Identity!.IsAuthenticated) return;

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var roleId = int.Parse(User.FindFirstValue("roleId")!);

            // 1️⃣ Fetch updated permissions
            var permissions = await masterRepo.GetPermissionsByEmpId(userId, roleId);

            // 2️⃣ Base claims (keep existing identity info)
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        new Claim("roleId", roleId.ToString())
    };

            var claimPermisionList =  permissions
                .SelectMany(fp => fp.Permissions.Values)            // flatten permission keys
                .Where(pk => !string.IsNullOrWhiteSpace(pk))        // safety check
                .Select(pk => new Claim("permission", pk))          // create claims
                .DistinctBy(c => c.Value)                           // remove duplicates
                .ToList();
            // 3️⃣ Add updated permission claims
            claims.AddRange(claimPermisionList);

             

            // 🔹 Replace auth cookie
            await HttpContext.SignOutAsync("Cookies");

            var identity = new ClaimsIdentity(claims, "Cookies");
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync("Cookies", principal);
        }
 
    }
}
