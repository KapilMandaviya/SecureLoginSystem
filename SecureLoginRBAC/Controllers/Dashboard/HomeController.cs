using BusinessLogic.BS_MasterRepo.Interface;
using DtoLayer;
using UtilityLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace SecureLoginRBAC.Controllers.Dashboard
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IBS_RoleMasterRepo masterRepo;
        public HomeController(IBS_RoleMasterRepo roleMasterRepo)
        {
            masterRepo = roleMasterRepo;
        }

        [Authorize(Policy = "Admission_Dashboard_VIEW")]
        public IActionResult Dashboard()
        {
            return View();
        }

        //[HttpGet]
        //public async Task<IActionResult> RoleMenuPermission()
        //{
        //    var menuJson  = HttpContext.Session.GetString("MenuData");
        //    if (string.IsNullOrEmpty(menuJson))
        //    {
        //        var MenuList = await this.masterRepo.fetchAllRoleMenuPermissionAsync(UserContext.roleId);
        //        menuJson = JsonConvert.SerializeObject(MenuList);
        //        HttpContext.Session.SetString("MenuData", menuJson);
        //    }
                

        //    return Json(menuJson);
        //}

        [HttpGet]
        public async Task<IActionResult> RoleMenuPermission()
        {
            var menuJson = HttpContext.Session.GetString("MenuData");
            List<RoleMenuDto> MenuList;

            if (string.IsNullOrEmpty(menuJson))
            {
                MenuList = await this.masterRepo.fetchAllRoleMenuPermissionAsync(UserContext.roleId);
                HttpContext.Session.SetString("MenuData", JsonConvert.SerializeObject(MenuList));
            }
            else
            {
                MenuList = JsonConvert.DeserializeObject<List<RoleMenuDto>>(menuJson);
            }

            return Json(MenuList); // Return actual object/array, not string
        }

    }
}
