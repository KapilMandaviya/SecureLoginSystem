using BusinessLogic.BS_MasterRepo.Interface;
using DtoLayer;
using RepositoryLayer.MasterRepo.Interface;
using UtilityLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_MasterRepo.Repository
{
    public class BS_CategoryMasterRepo(ICategoryMasterRepo masterRepo) : IBS_CategoryMasterRepo
    {
        public async Task<(bool result, string message)> deleteProgram(int? id) { 
            int createdBy= UserContext.EmpId;
            return await masterRepo.deleteProgram(id, createdBy);    
        }

        public async Task<List<CategoryMasterDto>> fetchAllAsync()
        {
            return await masterRepo.fetchAllAsync();
        }

        public async  Task<CategoryMasterDto> fetchAsyncById(int? id)
        {
            return await masterRepo.fetchAsyncById(id);   
        }

        public async Task<List<CategoryMasterDto>> getAllCategoryList()
        {
            return await masterRepo.getAllCategoryList();
        }

        public async Task<ApiResponse> SaveOrUpdateAsync(CategoryMasterDto master)
        {
            master.CreatedBy = UserContext.EmpId;
            return await masterRepo.SaveOrUpdateAsync(master);
        }
    }
}
