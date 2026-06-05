using DomainLayer.Data;
using DomainLayer.Data.Models;
using DomainLayer.Data.SP_DataModal;
using DtoLayer;
using RepositoryLayer.MasterRepo.Interface;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace RepositoryLayer.MasterRepo.Repository
{
    public class RoleMasterRepo : IRoleMasterRepo
    {
        private readonly AppDbContext _context;
        public RoleMasterRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task<(bool result, string message)> deleteUpdateAsync(int? id, int createdBy)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1️⃣ Get role
                var role = await _context.RoleMasters
                    .FirstOrDefaultAsync(x => x.Id == id && x.IsActive == true);

                if (role == null)
                {
                    return (false, "Role not found");
                }

                // 2️⃣ Check if role is assigned (IMPORTANT)
                bool isAssigned = await _context.Registrations
                    .AnyAsync(x => x.RoleId == id);

                if (isAssigned)
                {
                    return (false, "Role is already assigned. Cannot delete.");
                }

                // 3️⃣ Soft delete role permissions
                var permissions = await _context.RoleFormsPermissions
                    .Where(x => x.RoleId == id && x.IsActive == true)
                    .ToListAsync();

                foreach (var p in permissions)
                {
                    p.IsActive = false;
                    p.DeletedDate = DateTime.Now;
                    p.LastModify = "D";
                    p.CreatedBy = createdBy;
                }

                // 4️⃣ Soft delete role
                role.IsActive = false;
                role.DeletedDate = DateTime.Now;
                role.CreatedBy = createdBy;
                role.LastModify = "D";

                await _context.SaveChangesAsync();

                // 5️⃣ Commit transaction
                await transaction.CommitAsync();

                return (true, "Role and permissions deleted successfully");
            }
            catch (Exception ex)
            {
                // ❌ Rollback on error
                await transaction.RollbackAsync();
                return (false, $"Error occurred: {ex.Message}");
            }


        }

        public async Task<List<RoleMasterDto>> fetchAllAsync()
        {
            var result = await _context.RoleMasters
                       .Where(r => r.IsActive == true)
                       .Select(r => new RoleMasterDto
                       {
                           id = r.Id,
                           roleName = r.RoleName,
                           rolePriority = r.PriorityOrder,
                           isActive = r.IsActive ?? true,

                           formRolePermissions = _context.RoleFormsPermissions
                               .Where(p => p.RoleId == r.Id && p.IsActive == true)
                               .Select(p => new formRolePermissionDto
                               {
                                   FormId = p.FormId ?? 0,
                                   RoleId = p.RoleId,
                                   IsActive = p.IsActive == true,
                                   CreatedBy = p.CreatedBy,
                                   Id = p.Id,
                                   PermissionKey = p.PermissionKey,
                                   ActionId = p.ActionId ?? 0,
                                   CanView = p.CanView,
                                   ModuleId = p.ModuleId
                                   
                                   
                               })
                               .ToList()
                       }).OrderBy(x => x.rolePriority)
                       .ToListAsync();

            return result;
        }

        public async Task<bool> IsRoleAssignedAsync(int roleId)
        {
            return await _context.Registrations
                                 .AnyAsync(x => x.RoleId == roleId);
        }

        public async Task<List<formRolePermissionDto>> GetRoleWithPermissions(int roleId , int moduleId)
        {
            try
            {
                return await _context.RoleFormsPermissions
                        .Where(r => r.RoleId == roleId && r.ModuleId==moduleId && r.IsActive == true)
                        .Select(r => new formRolePermissionDto
                        {
                            Id = r.Id,
                            ModuleId=r.ModuleId,
                            RoleId=r.RoleId,
                            FormId=r.FormId,
                            ActionId=r.ActionId,
                            CanView=r.CanView,
                            IsActive=r.IsActive,
                            PermissionKey = r.PermissionKey
                           
                        })
                        .ToListAsync();

                //return result;
            }
            catch (Exception ex)
            {

                throw;
            }
        }


        public async Task<ApiResponse> SaveOrUpdateAsync(RoleMasterDto master)
        {
            try
            {

                var permissionTable = CreatePermissionTable(master.formRolePermissions);

                var roleIdParam = new SqlParameter("@RoleId", SqlDbType.Int)
                {
                    Direction = ParameterDirection.InputOutput,
                    Value = master.id
                };

                var parameters = new[]
                {
                    roleIdParam,
                    new SqlParameter("@RoleName", SqlDbType.NVarChar, 100) { Value = master.roleName },
                    new SqlParameter("@PriorityOrder", SqlDbType.Int) { Value = master.rolePriority },
                    new SqlParameter("@IsActive", SqlDbType.Bit) { Value = master.isActive },
                    new SqlParameter("@createdBy", SqlDbType.Int) { Value = master.createdBy },
                    new SqlParameter("@ModuleId", SqlDbType.Int) { Value = master.ModuleId },
                    new SqlParameter
                    {
                        ParameterName = "@Permissions",
                        SqlDbType = SqlDbType.Structured,
                        TypeName = "dbo.Type_RolePermissionList",
                        Value = permissionTable
                    }
                };

                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC dbo.SaveOrUpdateRoleWithPermissions @RoleId OUTPUT, @RoleName, @PriorityOrder, @IsActive, @createdBy, @ModuleId ,@Permissions",
                    parameters
                );

                master.id = (int)roleIdParam.Value;


                return new ApiResponse
                {
                    Success = true,
                    Message = "Role and permissions saved successfully"
                };
            }
            catch (Exception ex)
            {



                throw ex; // or log it
            }


        }

        public async Task<ApiResponse> SaveOrUpdatePriorityListAsync(List<RoleMasterDto> master)
        {
            try
            {
                foreach (var item in master)
                {
                    var role = await _context.RoleMasters.FindAsync(item.id);

                    if (role != null)
                    {
                        role.PriorityOrder = item.rolePriority;
                        role.UpdateDate = DateTime.Now;
                        role.LastModify = "U";
                        role.CreatedBy = item.createdBy;
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

        public Task<RoleMasterDto> fetchAsyncById(int? id)
        {
            throw new NotImplementedException();
        }

        public async Task<ApiResponse> checkRolePriority(RoleMasterDto master)
        {
            var errors = new Dictionary<string, string>();

            if (await _context.RoleMasters.AnyAsync(x =>
                x.RoleName == master.roleName && x.Id != master.id && x.IsActive == true))
                errors["roleName"] = "Role Name already exists.";

            if (await _context.RoleMasters.AnyAsync(x =>
               x.PriorityOrder == master.rolePriority && x.Id != master.id && x.IsActive == true))
                errors["rolePriority"] = "Role Priority already exists.";


            if (errors.Any())
            {
                return new ApiResponse
                {
                    Success = false,
                    Errors = errors
                };
            }
            else
            {
                return new ApiResponse
                {
                    Success = true,
                    Errors = null
                };
            }
        }

        public async Task<List<RoleMenuDto>> fetchAllRoleMenuPermissionAsync(int roleId)
        {
            try
            {
                // 1️⃣ Execute SP
                var flatMenus = await _context
                .Set<SP_RoleMenuFieldDto>()
                .FromSqlRaw("EXEC dbo.SP_getAllMenuSubMenuList @roleId = {0}", roleId)
                .AsNoTracking()
                .ToListAsync();

                // 2️⃣ Group submenus by ParentId
                var submenuLookup = flatMenus
                    .Where(x => x.MenuType == "submenu")
                    .GroupBy(x => x.ParentId)
                    .ToDictionary(g => g.Key, g => g.OrderBy(x => x.MenuOrder).ToList());

                // 3️⃣ Build parent menu list
                var result = flatMenus
                    .Where(x => x.MenuType == "parent" || x.MenuType == "parent-no-sub")
                    .OrderBy(x => x.MenuOrder)
                    .Select(parent => new RoleMenuDto
                    {
                        MenuId = parent.MenuId,
                        FormName = parent.FormName,
                        FormCode = parent.FormCode,
                        FormIcon = parent.FormIcon,
                        ControllerName = parent.Controller_Name,
                        ActionName = parent.ActionName,
                        MenuType = parent.MenuType,


                        ParentId = parent.ParentId,
                        MenuOrder = parent.MenuOrder,

                        // 4️⃣ Attach children if submenu exists
                        Children = submenuLookup.ContainsKey(parent.ParentId)
                            ? submenuLookup[parent.ParentId].Select(child => new RoleMenuDto
                            {
                                MenuId = child.MenuId,
                                FormName = child.FormName,
                                FormCode = child.FormCode,
                                FormIcon = child.FormIcon,
                                ControllerName = child.Controller_Name,
                                ActionName = child.ActionName,
                                MenuType = child.MenuType,

                                ParentId = child.ParentId,
                                MenuOrder = child.MenuOrder
                            }).OrderBy(x => x.MenuOrder).ToList()
                            : new List<RoleMenuDto>()
                    }).OrderBy(x => x.ParentId)
                    .ToList();

                return result;
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public async Task<List<UserPermissionDto>> GetPermissionsByEmpId(int userId, int roleId)
        {
            try
            {
                var permissionsList = await _context.Set<SP_UserRolePermissionDto>()
             .FromSqlRaw("EXEC dbo.SP_getPermissionByUserRole @EmpId={0}, @RoleId={1}",
                          userId, roleId)
             .AsNoTracking()
             .ToListAsync();

                return permissionsList.Select(x => new UserPermissionDto
                {
                    FormCode = x.FormCode,
                    ActionName = x.ActionName,
                    PermissionKey = x.PermissionKey

                }).ToList();
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        private DataTable CreatePermissionTable(IEnumerable<formRolePermissionDto> permissions)
        {
            var table = new DataTable();

            //table.Columns.Add("RoleId", typeof(int));
            //table.Columns.Add("ModuleId", typeof(int));
            table.Columns.Add("FormId", typeof(int));
            table.Columns.Add("ActionId", typeof(int));
            table.Columns.Add("PermissionKey", typeof(string));
            table.Columns.Add("CanView", typeof(byte));
            table.Columns.Add("IsActive", typeof(bool));
            table.Columns.Add("CreatedBy", typeof(int));

            foreach (var p in permissions)
            {
                table.Rows.Add(
                    //p.RoleId,
                    //p.ModuleId,
                    p.FormId,
                    p.ActionId,
                    p.PermissionKey,
                    p.CanView,                  // Assuming CanView indicates active permission
                    p.IsActive,
                    p.CreatedBy
                );
            }

            return table;
        }

    }
}
