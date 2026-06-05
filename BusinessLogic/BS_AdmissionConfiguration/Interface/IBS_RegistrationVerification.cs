using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.BS_AdmissionConfiguration.Interface
{
    public interface IBS_RegistrationVerification
    {
        Task<(bool result, string message)> SaveOrUpdateAsync(RegistrationVerificationDto settings);
        Task<RegistrationVerificationDto> fetchAllAsync();
        
        

    }
}
