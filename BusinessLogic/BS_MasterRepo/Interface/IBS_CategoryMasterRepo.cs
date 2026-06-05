using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_MasterRepo.Interface
{
    public interface IBS_CategoryMasterRepo
    {
        Task<ApiResponse> SaveOrUpdateAsync(CategoryMasterDto master);
        Task<List<CategoryMasterDto>> fetchAllAsync();
        Task<List<CategoryMasterDto>> getAllCategoryList();
        Task<CategoryMasterDto> fetchAsyncById(int? id);
        Task<(bool result, string message)> deleteProgram(int? id);
    }
}
