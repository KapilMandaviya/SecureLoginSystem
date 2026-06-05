using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_MasterRepo.Interface
{
    public interface IBS_AcademicYearRepo
    {
        Task<ApiResponse> SaveOrUpdateAsync(AcadamicYearDto master);
        Task<List<AcadamicYearDto>> fetchAllAsync();
        Task<AcadamicYearDto> fetchAsyncById(int? id);
        Task<(bool result, string message)> makeActiveYear(int? id);

        Task<AcadamicYearDto> GetCurrentAcademicYearAsync();
    }
}
