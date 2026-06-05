using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.AdmissionConfiguration.Interface
{
    public interface IRegistrationVerificationRepo
    {

        Task<(bool result, string message)> SaveOrUpdateAsync(RegistrationVerificationDto settings);
        Task<RegistrationVerificationDto> fetchAllAsync();


    }
}
