using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.MasterRepo.Interface
{
    public interface IAcademicYearRepo
    {
        Task<ApiResponse> SaveOrUpdateAsync(AcadamicYearDto master);
        Task<List<AcadamicYearDto>> fetchAllAsync();
        Task<AcadamicYearDto> fetchAsyncById(int? id);
        Task<(bool result, string message)> makeActiveYear(int? id, int createdBy);
        Task<AcadamicYearDto> GetCurrentAcademicYearAsync();
    }
}
