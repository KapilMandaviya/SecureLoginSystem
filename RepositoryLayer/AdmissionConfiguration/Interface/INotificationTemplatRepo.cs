using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.AdmissionConfiguration.Interface
{
    public interface INotificationTemplatRepo
    {
        Task<ApiResponse> SaveOrUpdateAsync(NotificationTemplateDto settings);
        Task<List<NotificationTemplateDto>> fetchAllAsync();

        Task<NotificationTemplateDto> getById(int? Id);

        Task<(bool result, string message)> deleteAsync(int? id, int? createdBy);
    }
}
