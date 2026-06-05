using DtoLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.AuthnticateRepo.Interface
{
    public interface IBS_OTPVerifyService
    {
        Task<(bool result, string errorMessage)> SaveEmailOtpAsync(UserLoginOtpDto otp);
        Task<UserLoginOtpDto?> GetValidEmailOtpAsync(int EmpId);
        Task<(bool result, string errorMessage)> MarkOtpUsedAsync(int Id);
    }
}
