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
    public class BS_RegistrationVerification : IBS_RegistrationVerification
    {
        private readonly IRegistrationVerificationRepo _repo;
        public BS_RegistrationVerification(IRegistrationVerificationRepo repo)
        {
            _repo = repo;
        }
        public async Task<RegistrationVerificationDto> fetchAllAsync()
        {
            return await _repo.fetchAllAsync(); 
        }

        public async Task<(bool result, string message)> SaveOrUpdateAsync(RegistrationVerificationDto settings)
        {
            settings.CreatedBy = UserContext.EmpId;
            return await _repo.SaveOrUpdateAsync(settings);
        }
    }
}
