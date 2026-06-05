using BusinessLogic.BS_MasterRepo.Interface;
using DtoLayer;
using RepositoryLayer.MasterRepo.Interface;
using RepositoryLayer.MasterRepo.Repository;
using UtilityLayer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_MasterRepo.Repository
{
    public class BS_RoleMasterRepo : IBS_RoleMasterRepo
    {
        private readonly IRoleMasterRepo _repo;
        public BS_RoleMasterRepo(IRoleMasterRepo roleMasterRepo)
        {
            _repo = roleMasterRepo;
        }
        public async Task<(bool result, string message)> deleteUpdateAsync(int? id)
        {
            return await _repo.deleteUpdateAsync(id,UserContext.EmpId);   
        }

        public async Task<List<RoleMasterDto>> fetchAllAsync()
        {
            return await _repo.fetchAllAsync();
        }
        
        public async Task<List<formRolePermissionDto>> GetRoleWithPermissions(int roleId,int moduleId)
        {
            return await _repo.GetRoleWithPermissions(roleId,moduleId);
        }

        public async Task<bool> IsRoleAssignedAsync(int roleId)
        {
            return await _repo.IsRoleAssignedAsync(roleId);
        }

        public async Task<RoleMasterDto> fetchAsyncById(int? id)
        {
            return await _repo.fetchAsyncById(id);  
        }

        public async Task<ApiResponse> SaveOrUpdateAsync(RoleMasterDto master)
        {
            master.createdBy = UserContext.EmpId;

            foreach (var setting in master.formRolePermissions)
            {
                setting.CreatedBy = UserContext.EmpId;
            }
            return await _repo.SaveOrUpdateAsync(master); 
            
        }

        public async Task<ApiResponse> checkRolePriority(RoleMasterDto master)
        {
            return await _repo.checkRolePriority(master);
        }

        public async Task<ApiResponse> SaveOrUpdatePriorityListAsync(List<RoleMasterDto> master)
        {
            foreach (var setting in master)
            {
                setting.createdBy = UserContext.EmpId;
            }
            return await _repo.SaveOrUpdatePriorityListAsync(master);

            
        }

        public async Task<List<RoleMenuDto>> fetchAllRoleMenuPermissionAsync(int roleId)
        {
            return await _repo.fetchAllRoleMenuPermissionAsync(roleId);

        }

        public async Task<List<FormPermissionDto>> GetPermissionsByEmpId(int userId, int roleId)
        {
            var permissions = await _repo.GetPermissionsByEmpId(userId, roleId);

            var groupedPermissions = permissions
                .GroupBy(p => p.FormCode)
                .Select(g => new FormPermissionDto
                {
                    FormCode = g.Key,
                    Permissions = g
                        .Where(x => !string.IsNullOrWhiteSpace(x.PermissionKey))
                        .ToDictionary(
                            x => x.ActionName,       // key = action name
                            x => x.PermissionKey     // value = permission key
                        )
                })
                .ToList();

            return groupedPermissions;
        }


    }
}
