using RepositoryLayer.AuthnticateRepo.Interface;
using DtoLayer;

namespace RepositoryLayer.AuthnticateRepo.Repository
{
    public class BS_OTPVerifyService :IBS_OTPVerifyService
    {
        private readonly IOTPVerifyService _emailService;

        public BS_OTPVerifyService(IOTPVerifyService emailService)
        {
            _emailService = emailService;   
        }

        public async Task<UserLoginOtpDto?> GetValidEmailOtpAsync(int EmpId)
        {
            return await _emailService.GetValidEmailOtpAsync(EmpId);
        }

        public async Task<(bool result, string errorMessage)> MarkOtpUsedAsync(int Id)
        {
            return await _emailService.MarkOtpUsedAsync(Id);
        }

        public async Task<(bool result, string errorMessage)> SaveEmailOtpAsync(UserLoginOtpDto otp)
        {
            return await _emailService.SaveEmailOtpAsync(otp);
        }

         
    }

}
