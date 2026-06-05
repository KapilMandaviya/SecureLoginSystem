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
    public class BS_AcademicYearRepo : IBS_AcademicYearRepo
    {
        private readonly IAcademicYearRepo _yearRepo;
        public BS_AcademicYearRepo(IAcademicYearRepo yearRepo)
        {
            _yearRepo = yearRepo;
        }
        public async Task<List<AcadamicYearDto>> fetchAllAsync()
        {
            return await _yearRepo.fetchAllAsync();
        }

        public async Task<AcadamicYearDto> fetchAsyncById(int? id)
        {
            return await _yearRepo.fetchAsyncById(id);  
        }

        public Task<AcadamicYearDto> GetCurrentAcademicYearAsync()
        {
            return _yearRepo.GetCurrentAcademicYearAsync();
        }

        public async Task<(bool result, string message)> makeActiveYear(int? id)
        {
            int createdBy = UserContext.EmpId;
            return await _yearRepo.makeActiveYear(id, createdBy);   
        }

        public async Task<ApiResponse> SaveOrUpdateAsync(AcadamicYearDto master)
        {

            master.CreatedBy = UserContext.EmpId;
            // Parse dates if they are strings
            DateTime startDate = DateTime.Parse(master.StartDate);
            DateTime endDate = DateTime.Parse(master.EndDate);

            // Set CurrentAcYear as "YYYY-YYYY"
            master.CurrentAcYear = $"{startDate.Year}-{endDate.Year}";
            return await _yearRepo.SaveOrUpdateAsync(master);
        }
    }
}
