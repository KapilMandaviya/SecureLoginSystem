using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_AdmissionConfiguration.Interface
{
    public interface IBS_NotificationTemplateSetting
    {
        Task<ApiResponse> SaveOrUpdateAsync(NotificationTemplateDto settings);
        Task<List<NotificationTemplateDto>> fetchAllAsync();

        Task<NotificationTemplateDto> getById(int? Id);

        Task<(bool result, string message)> deleteAsync(int? id);
    }
}
