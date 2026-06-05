using DomainLayer.Data;
using DomainLayer.Data.Models;
using DtoLayer;
using RepositoryLayer.SuperAdminRepo.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace RepositoryLayer.SuperAdminRepo.Repository
{
    public class FormMasterRepo : IFormMasterRepo
    {
        private readonly AppDbContext _context;
        public FormMasterRepo(AppDbContext dbContext)
        {
            _context = dbContext;
        }

        private string Normalize(string name) => name?.Trim().ToUpper();


        public async Task<(bool result, string message)> deleteUpdateAsync(int? id, int? createdBy)
        {
            var form = _context.FormMasters.FirstOrDefault(f => f.Id == id && f.IsActive == true);

            if (form == null)
                return (false, "Form not found");

            // 🔒 Check if form is assigned to any role
            bool isAssigned = await _context.RoleFormsPermissions
                .AnyAsync(rf => rf.FormId == id && rf.IsActive == true);

            if (isAssigned)
            {
                return (false, "This form is already assigned to a role and cannot be deleted.");
            }

            if (form != null)
            {
                form.IsActive = false;
                form.DeletedDate = DateTime.Now;
                form.LastModify = "D";
                form.CreatedBy = createdBy;
                await _context.SaveChangesAsync();
                return (true, "Deleted successfully");
            }
            else
            {
                return (false, "Record not found");
            }
        }

        public async Task<List<formMasterDto>> fetchAllAsync()
        {
            //return await _context.FormMasters
            //    .Select(f => new formMasterDto
            //    {
            //        Id = f.Id,
            //        ModuleId=f.ModuleId,
            //        ActionName = f.ActionName,
            //        ControllerName = f.ControllerName,
            //        //FormCode = f.FormCode,
            //        moduleName=f.ModuleId
            //        FormIcon = f.FormIcon,
            //        FormName = f.FormName,
            //        IsActive = f.IsActive ?? true,
            //        IsMenu = f.IsMenu ?? true,
            //        LastModify = f.LastModify,
            //        MenuOrder = f.MenuOrder,
            //        ParentId = f.ParentId,
            //        MenuType = f.MenuType,

            //    }).Where(f => f.IsActive == true)
            //    .ToListAsync();

            return await (
                    from f in _context.FormMasters
                    join m in _context.ModuleDetails   // or Modules table
                        on f.ModuleId equals m.Id
                    where (f.IsActive ?? true) == true
                    select new formMasterDto
                    {
                        Id = f.Id,
                        ModuleId = f.ModuleId,
                        moduleName = m.Name ?? "",   // fetched from joined table
                        ActionName = f.ActionName,
                        ControllerName = f.ControllerName,
                        FormIcon = f.FormIcon,
                        FormName = f.FormName,
                        IsActive = f.IsActive ?? true,
                        IsMenu = f.IsMenu ?? true,
                        LastModify = f.LastModify,
                        MenuOrder = f.MenuOrder,
                        ParentId = f.ParentId,
                        MenuType = f.MenuType
                    }
                ).ToListAsync();


        }

        public async Task<List<formMasterDto>> fetchAllFormAsync(int moduleId)
        {



            var forms = await _context.FormMasters
                .Select(f => new formMasterDto
                {
                    Id = f.Id,
                    ModuleId = f.ModuleId,
                    ActionName = f.ActionName,
                    ControllerName = f.ControllerName,
                    FormCode = f.FormCode,
                    FormIcon = f.FormIcon,
                    FormName = f.FormName,
                    IsActive = f.IsActive ?? true,
                    IsMenu = f.IsMenu ?? true,
                    LastModify = f.LastModify,
                    MenuOrder = f.MenuOrder,
                    ParentId = f.ParentId,
                    MenuType = f.MenuType,
                    ActionList = f.ActionList,

                })
                .Where(x => x.IsActive == true && x.ModuleId == moduleId)
                .ToListAsync();

            if (!forms.Any())
                return forms;

            // 🔹 STEP 2: Collect ALL Action IDs from ActionList
            var actionIds = forms
                .Where(f => !string.IsNullOrWhiteSpace(f.ActionList))
                .SelectMany(f => f.ActionList!
                    .Split(',', StringSplitOptions.RemoveEmptyEntries))
                .Select(id => int.Parse(id))
                .Distinct()
                .ToList();

            if (!actionIds.Any())
                return forms;

            // 🔹 STEP 3: Fetch Actions (Single Query)
            var actions = await _context.ActionMasters
                .Where(a => actionIds.Contains(a.Id))
                .Select(a => new ActionMasterDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    IsActive = a.IsActive,
                    CreatedBy = a.CreatedBy
                })
                .ToListAsync();

            // 🔹 STEP 4: Map Actions → Forms
            foreach (var form in forms)
            {
                if (string.IsNullOrWhiteSpace(form.ActionList))
                    continue;

                var ids = form.ActionList
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(int.Parse)
                    .ToList();

                form.actionPayLoad = actions
                    .Where(a => a.Id.HasValue && ids.Contains(a.Id.Value))
                    .ToList();
            }

            return forms;

        }

        public async Task<formMasterDto> fetchAsyncById(int? id)
        {
            return await _context.FormMasters
                .Where(f => f.Id == id && f.IsActive == true)
                .Select(f => new formMasterDto
                {
                    Id = f.Id,
                    ModuleId = f.ModuleId,
                    ActionName = f.ActionName,
                    ControllerName = f.ControllerName,
                    FormCode = f.FormCode,
                    FormIcon = f.FormIcon,
                    FormName = f.FormName,
                    IsActive = f.IsActive ?? true,
                    IsMenu = f.IsMenu ?? true,
                    ActionList = f.ActionList,
                    LastModify = f.LastModify,
                    MenuOrder = f.MenuOrder,
                    ParentId = f.ParentId,
                    MenuType = f.MenuType,

                })
                .FirstOrDefaultAsync();
        }

        public async Task<ApiResponse> SaveOrUpdateAsync(formMasterDto master)
        {
            try
            {
                List<int> actionIds = new List<int>();

                var errors = new Dictionary<string, string>();

                if (await _context.FormMasters.AnyAsync(x =>
                   x.FormCode == master.FormCode && x.Id != master.Id && x.IsActive == true))
                    errors["formCode"] = "Form code already exists.";


                if (errors.Any())
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Errors = errors
                    };
                }


                foreach (var act in master.actionPayLoad)
                {
                    if (act.Id > 0)
                    {
                        // Existing action
                        var existing = await _context.ActionMasters.FindAsync(act.Id);
                        if (existing != null)
                        {
                            actionIds.Add(existing.Id);
                        }
                    }
                    else
                    {
                        act.Name = Normalize(act.Name);
                        // New action
                        var existing = await _context.ActionMasters
                            .FirstOrDefaultAsync(x => x.Name.ToUpper() == act.Name);

                        if (existing != null)
                        {
                            actionIds.Add(existing.Id);
                        }
                        else
                        {
                            var newAction = new ActionMaster
                            {
                                Name = act.Name,
                                IsActive = true,
                                CreatedDate = DateTime.Now,
                                CreatedBy = master.CreatedBy,
                                LastModify = "I",

                            };
                            await _context.ActionMasters.AddAsync(newAction);
                            await _context.SaveChangesAsync();
                            actionIds.Add(newAction.Id);
                        }
                    }
                }

                // Store in FormMaster as comma-separated string
                master.ActionList = string.Join(",", actionIds);



                var result = _context.FormMasters.FirstOrDefault(f => f.Id == master.Id && f.IsActive == true);

                int maxMenuOrder = 0;
                int maxMenuOrderSub = 0;


                if (master.ParentId == null && (master.MenuType == "parent" || master.MenuType == "parent-no-sub"))
                {
                    // Parent menu
                    maxMenuOrder = await _context.FormMasters
                        .Where(x =>
                                  x.IsActive ?? true
                                 && (x.MenuType == "parent" || x.MenuType == "parent-no-sub"))
                        .MaxAsync(x => (int?)x.ParentId) ?? 0;

                    master.ParentId = maxMenuOrder + 1;
                }



                // ✅ Calculate menu order correctly
                if (master.ParentId != null && master.MenuType == "submenu")
                {
                    // Parent menu
                    maxMenuOrderSub = await _context.FormMasters
                        .Where(x => x.ParentId == master.ParentId && x.IsActive == true)
                        .MaxAsync(x => (int?)x.MenuOrder) ?? 0;

                    master.MenuOrder = maxMenuOrderSub + 1;
                }



                if (result == null)
                {
                    await _context.FormMasters.AddAsync(new FormMaster
                    {
                        Id = master.Id,
                        ModuleId = master.ModuleId,
                        ActionName = master.ActionName,
                        ControllerName = master.ControllerName,
                        FormCode = master.FormCode,
                        FormIcon = master.FormIcon,
                        FormName = master.FormName,
                        IsActive = master.IsActive,
                        IsMenu = master.IsMenu,
                        ActionList = master.ActionList,
                        LastModify = "I",
                        MenuOrder = master.MenuOrder ?? 0,
                        ParentId = master.ParentId,
                        MenuType = master.MenuType,
                        CreatedDate = DateTime.Now,
                        CreatedBy = master.CreatedBy,


                    });

                    await _context.SaveChangesAsync();
                    return new ApiResponse { Success = true, Message = "Form Master added successfully." };

                }
                else
                {
                    //result.ModuleId = master.ModuleId;
                    result.MenuType = master.MenuType;
                    result.ActionName = master.ActionName;
                    result.ControllerName = master.ControllerName;
                    //result.FormCode = master.FormCode;
                    result.FormIcon = master.FormIcon;
                    result.FormName = master.FormName;
                    result.MenuOrder = master.MenuOrder ?? 0;
                    result.IsMenu = master.IsMenu;
                    result.ActionList = master.ActionList;
                    result.ParentId = master.ParentId;
                    result.IsActive = master.IsActive;
                    result.LastModify = "U";
                    result.UpdateDate = DateTime.Now;
                    result.CreatedBy = master.CreatedBy;

                    await _context.SaveChangesAsync();
                    return new ApiResponse { Success = true, Message = "Form Master updated successfully." };
                }

            }
            catch (Exception ex)
            {

                throw;
            }


        }

        public async Task<ApiResponse> SaveOrUpdateMenuOrderListAsync(List<MenuOrderDto> master)
        {
            try
            {
                foreach (var item in master)
                {
                    var menu = await _context.FormMasters
                        .FirstOrDefaultAsync(x => x.Id == item.formId);

                    if (menu != null)
                    {
                        menu.ParentId = item.ParentId == 0 ? menu.ParentId : item.ParentId;
                        menu.MenuOrder = item.MenuOrder;
                        menu.UpdateDate = DateTime.Now;
                        menu.CreatedBy = item.createdBy ?? 0;
                        menu.LastModify = "U";
                    }
                }

                await _context.SaveChangesAsync();
                return new ApiResponse
                {
                    Success = true,
                    Message = "Saved successfully"
                };
            }
            catch
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Something went wrong"
                };
            }
        }

        public async Task<List<RoleMenuDto>> FetchMenuWithSubMenuAsync()
        {
            var menus = await _context.FormMasters
                .Where(x => x.IsActive == true)
                .Select(x => new
                {
                    x.Id,
                    x.FormName,
                    x.FormCode,
                    x.FormIcon,
                    x.MenuOrder,
                    x.ControllerName,
                    x.ActionName,
                    x.ParentId,
                    x.MenuType
                })
                .ToListAsync();

            var parentMenus = menus
                .Where(x => x.MenuType == "parent" || x.MenuType == "parent-no-sub")
                .OrderBy(x => x.MenuOrder)
                .Select(parent => new RoleMenuDto
                {
                    MenuId = parent.Id,
                    FormName = parent.FormName,
                    FormCode = parent.FormCode,
                    FormIcon = parent.FormIcon,
                    MenuOrder = parent.MenuOrder,
                    ControllerName = parent.ControllerName,
                    ActionName = parent.ActionName,
                    MenuType = parent.MenuType,
                    ParentId = parent.ParentId,

                    Children = menus
                        .Where(sub => sub.MenuType == "submenu" && sub.ParentId == parent.ParentId)
                        .OrderBy(sub => sub.MenuOrder)
                        .Select(sub => new RoleMenuDto
                        {
                            MenuId = sub.Id,
                            ParentId = sub.ParentId,

                            FormName = sub.FormName,
                            ControllerName = sub.ControllerName,
                            ActionName = sub.ActionName,
                            MenuOrder = sub.MenuOrder
                        })
                        .ToList()
                })
                .ToList();

            return parentMenus;
        }

        public async Task<List<ActionMasterDto>> getAllOptionList()
        {
            var actions = _context.ActionMasters
                .Where(x => x.IsActive == true)
                .OrderBy(x => x.Name)
                .Select(x => new ActionMasterDto
                {
                    Id = x.Id,
                    Name = x.Name

                })
                .ToList();

            return actions;
        }

        public async Task<List<ModuleDetailsDto>> getAllModuleList()
        {
            return await _context.ModuleDetails.Where(x => x.IsActive == true).Select(x => new ModuleDetailsDto
            {
                Id = x.Id,
                Name = x.Name,
                IsActive = x.IsActive,
                Description = x.Description,
            }).ToListAsync();

        }
    }
}
