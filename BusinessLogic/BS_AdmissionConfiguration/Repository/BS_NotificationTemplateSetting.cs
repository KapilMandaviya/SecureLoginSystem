using BusinessLogic.BS_AdmissionConfiguration.Interface;
using DtoLayer;
using RepositoryLayer.AdmissionConfiguration.Interface;
using UtilityLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_AdmissionConfiguration.Repository
{
    public class BS_NotificationTemplateSetting : IBS_NotificationTemplateSetting
    {
        private readonly INotificationTemplatRepo _repo;
        public BS_NotificationTemplateSetting(INotificationTemplatRepo repo)
        {
            _repo = repo;
        }
        public async Task<(bool result, string message)> deleteAsync(int? id)
        {
            return await _repo.deleteAsync(id, UserContext.EmpId);
        }

        public async Task<List<NotificationTemplateDto>> fetchAllAsync()
        {
            return await _repo.fetchAllAsync();
        }

        public async Task<NotificationTemplateDto> getById(int? Id)
        {
            return await _repo.getById(Id);
        }

        public async Task<ApiResponse> SaveOrUpdateAsync(NotificationTemplateDto settings)
        {
            settings.CreatedBy = UserContext.EmpId;
            return await _repo.SaveOrUpdateAsync(settings);
        }
    }
}
