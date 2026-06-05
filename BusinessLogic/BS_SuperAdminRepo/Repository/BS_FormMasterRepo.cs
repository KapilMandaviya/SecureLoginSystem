using BusinessLogic.BS_SuperAdminRepo.Interface;
using DtoLayer;
using RepositoryLayer.SuperAdminRepo.Interface;
using UtilityLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_SuperAdminRepo.Repository
{
    public class BS_FormMasterRepo : IBS_FormMasterRepo
    {
        private readonly IFormMasterRepo _form;
        public BS_FormMasterRepo(IFormMasterRepo masterRepo)
        {
            _form = masterRepo;
        }

        public async Task<(bool result, string message)> deleteUpdateAsync(int? id)
        {
            int createdBy = UserContext.EmpId;
            return await _form.deleteUpdateAsync(id, createdBy);
        }

        public async Task<List<formMasterDto>> fetchAllAsync()
        {
            return await _form.fetchAllAsync();
        }


        public async Task<List<formMasterDto>> fetchAllFormAsync(int moduleId)
        {
            return await _form.fetchAllFormAsync(moduleId);
        }

        public async Task<formMasterDto> fetchAsyncById(int? id)
        {
            return await _form.fetchAsyncById(id);
        }

        public async Task<ApiResponse> SaveOrUpdateAsync(formMasterDto master)
        {
            master.CreatedBy = UserContext.EmpId;
            return await _form.SaveOrUpdateAsync(master);
        }

        public async Task<ApiResponse> SaveOrUpdateMenuOrderListAsync(List<MenuOrderDto> master)
        {
            foreach (var item in master)
            {
                item.createdBy = UserContext.EmpId;
            }
            return await _form.SaveOrUpdateMenuOrderListAsync(master);
        }

        public async Task<List<RoleMenuDto>> FetchMenuWithSubMenuAsync()
        {
            return await _form.FetchMenuWithSubMenuAsync();
        }

        public async Task<List<ActionMasterDto>> getAllOptionList()
        {
            return await _form.getAllOptionList();
        }

        public async Task<List<ModuleDetailsDto>> getAllModuleList()
        {
            return await _form.getAllModuleList();

        }
    }
}
