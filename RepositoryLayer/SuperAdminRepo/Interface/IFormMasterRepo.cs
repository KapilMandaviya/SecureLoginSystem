using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.SuperAdminRepo.Interface
{
    public interface IFormMasterRepo
    {
        Task<ApiResponse> SaveOrUpdateAsync(formMasterDto master);
        Task<List<formMasterDto>> fetchAllAsync();
        Task<List<formMasterDto>> fetchAllFormAsync(int moduleId);

        Task<formMasterDto> fetchAsyncById(int? id);
        Task<(bool result, string message)> deleteUpdateAsync(int? id, int? createdBy);

        Task<ApiResponse> SaveOrUpdateMenuOrderListAsync(List<MenuOrderDto> master);

        Task<List<RoleMenuDto>> FetchMenuWithSubMenuAsync();

        Task<List<ActionMasterDto>> getAllOptionList();

        Task<List<ModuleDetailsDto>> getAllModuleList();


    }
}
