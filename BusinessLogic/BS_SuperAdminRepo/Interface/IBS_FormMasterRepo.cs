using DomainLayer.Data.Models;
using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_SuperAdminRepo.Interface
{
    public interface IBS_FormMasterRepo
    {
        Task<ApiResponse> SaveOrUpdateAsync(formMasterDto master);
        Task<List<formMasterDto>> fetchAllAsync();
        Task<List<ModuleDetailsDto>> getAllModuleList();
        Task<List<formMasterDto>> fetchAllFormAsync(int moduleId);

        Task<formMasterDto> fetchAsyncById(int? id);
        Task<(bool result, string message)> deleteUpdateAsync(int? id);

        Task<ApiResponse> SaveOrUpdateMenuOrderListAsync(List<MenuOrderDto> master);

        Task<List<RoleMenuDto>> FetchMenuWithSubMenuAsync();
        Task<List<ActionMasterDto>> getAllOptionList();
    }
}
