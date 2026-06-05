using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_MasterRepo.Interface
{
    public interface IBS_RoleMasterRepo
    {
        Task<ApiResponse> SaveOrUpdateAsync(RoleMasterDto master);
        Task<List<RoleMasterDto>> fetchAllAsync();
        Task<List<formRolePermissionDto>> GetRoleWithPermissions(int roleId,int moduleId);

        Task<bool> IsRoleAssignedAsync(int roleId);
        Task<ApiResponse> checkRolePriority(RoleMasterDto master);

        Task<RoleMasterDto> fetchAsyncById(int? id);
        Task<(bool result, string message)> deleteUpdateAsync(int? id);

        Task<ApiResponse> SaveOrUpdatePriorityListAsync(List<RoleMasterDto> master);

        Task<List<RoleMenuDto>> fetchAllRoleMenuPermissionAsync(int roleId);
        Task<List<FormPermissionDto>> GetPermissionsByEmpId(int userId, int roleId);
    }
}
