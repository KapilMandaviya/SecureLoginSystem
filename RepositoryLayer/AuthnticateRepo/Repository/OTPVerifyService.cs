using RepositoryLayer.AuthnticateRepo.Interface;
using Microsoft.Extensions.Configuration; 
using DtoLayer;
using DomainLayer.Data;
using DomainLayer.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace RepositoryLayer.AuthnticateRepo.Repository
{
    public class OTPVerifyService :IOTPVerifyService
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public OTPVerifyService(IConfiguration config,AppDbContext appDbContext)
        {
            _config = config;
            _context = appDbContext;
        }

        public async Task<UserLoginOtpDto?> GetValidEmailOtpAsync(int EmpId)
        {
            return await _context.EmailLoginOtps
                .Where(x => x.EmpId == EmpId && x.IsUsed == false)
              .Select(a => new UserLoginOtpDto
              {
                  EmpId = a.EmpId,
                  Id = a.Id,
                  IsUsed=a.IsUsed,
                  ExpiryTime=a.ExpiryTime,
                  OtpHash = a.OtpHash,
                  Email = a.Email,
                

              })
              .FirstOrDefaultAsync();
        }

        public async Task<(bool result, string errorMessage)> MarkOtpUsedAsync(int Id)
        {
            try
            {
                var otpUsed = await _context.EmailLoginOtps
                        .Where(x => x.Id == Id && x.IsUsed == false).FirstOrDefaultAsync();

                if (otpUsed != null)
                {
                    otpUsed.IsUsed = true;
                    otpUsed.UsedAt = DateTime.Now;
                }
                await _context.SaveChangesAsync();
                return (true, "OTP Verified SuccessFully.");
            }
            catch (Exception ex)
            {
                return (false, "Failed to mark OTP as used");
            }

        }

        public async Task<(bool result, string errorMessage)> SaveEmailOtpAsync(UserLoginOtpDto otp)
        {
            try
            {
                var existingRecords = await _context.EmailLoginOtps.Where(x => x.EmpId == otp.EmpId)
                    .FirstOrDefaultAsync();
                var userLoginOtp = new EmailLoginOtp();
                if (existingRecords == null)
                {
                    userLoginOtp.EmpId = otp.EmpId;
                    userLoginOtp.Email = otp.Email;
                    userLoginOtp.ExpiryTime = otp.ExpiryTime;
                    userLoginOtp.IsUsed = false;
                    userLoginOtp.OtpHash = otp.OtpHash;
                    userLoginOtp.OtpType = otp.OtpType; 
                    userLoginOtp.CreatedAt=DateTime.Now;

                    await _context.AddAsync(userLoginOtp);
                }
                else
                {
                    existingRecords.OtpHash=otp.OtpHash.ToString();
                    existingRecords.Email=otp.Email;
                    existingRecords.IsUsed = false;
                    existingRecords.OtpType = otp.OtpType;
                    existingRecords.ExpiryTime= otp.ExpiryTime;
                    existingRecords.CreatedAt=DateTime.Now; 
                    

                }
                await _context.SaveChangesAsync();

                return (true, "Authentication settings saved successfully");
            }
            catch (Exception ex)
            {

                return (false, "Something went wrong!"); ;
            }
        }

        
    }

}
