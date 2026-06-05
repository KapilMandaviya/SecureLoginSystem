using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.MasterRepo.Interface
{
    public interface ICategoryMasterRepo
    {
        Task<ApiResponse> SaveOrUpdateAsync(CategoryMasterDto master);
        Task<List<CategoryMasterDto>> fetchAllAsync();
        Task<List<CategoryMasterDto>> getAllCategoryList();
        Task<CategoryMasterDto> fetchAsyncById(int? id);
        Task<(bool result, string message)> deleteProgram(int? id, int createdBy);
    }
}
