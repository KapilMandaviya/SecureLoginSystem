
using DomainLayer.Data;
using DomainLayer.Data.Models;
using DtoLayer;
using RepositoryLayer.AuthnticateRepo.Interface;
using Microsoft.EntityFrameworkCore;


namespace RepositoryLayer.AuthnticateRepo.Repository
{
    public class AuthnticateLogin : IAuthnticateLogin
    {
        private readonly AppDbContext _context;
        public AuthnticateLogin(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }

        public async Task<(int result, string errorMessage)> clearTwoFactorDetails(int? EmpId)
        {
            var existing = await _context.UserTwoFactors
                      .FirstOrDefaultAsync(x =>
                          x.EmpId == EmpId &&
                          x.IsActive == true);

            if (existing == null)
            {
                return (0, "Secret key not found");
            }
            else
            {
                existing.SecretKey = null;
                existing.UpdatedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            return (1, "User secret key stored");
        }

        public async Task<List<AuthenticationSettingDto>> getListOfAuthSetting()
        {
            //  var AuthSetting = await _context.AuthenticationSettings.Where(x => x.IsEnabled == true && x.IsActive == true).ToListAsync();

            try
            {
                return await _context.AuthenticationSettings
                       .Where(x => x.IsEnabled && x.IsActive == true)
                       .Select(a => new AuthenticationSettingDto
                       {
                           AuthSettingId = a.AuthSettingId,
                           AuthCode = a.AuthCode,
                           AuthName = a.AuthName,
                           IsEnabled = a.IsEnabled,
                           Otpattempt = a.Otpattempt,
                           OtpresetTime = a.OtpresetTime,
                           IsActive = a.IsActive,
                           CreatedBy=a.CreatedBy,
                           OtpexpiryTime = a.OtpexpiryTime,
                           CreatedDate = a.CreatedDate,


                       })
                       .ToListAsync();
            }
            catch (Exception ex)
            {

                throw;
            }


        }

        public async Task<RegistrationDto> getRegistrationDetails(string? email)
        {
            return await _context.Registrations
                .Where(x => x.IsActive == true && x.Email == email)
              .Select(a => new RegistrationDto
              {
                  Email = a.Email,
                  IsActive = a.IsActive,
                  EmpId = a.EmpId

              })
              .FirstOrDefaultAsync();

        }

        public async Task<UserTwoFactorDto> getUserTwoFactorDto(int EmpId)
        {
            return await _context.UserTwoFactors
                .Where(x => x.EmpId == EmpId && x.IsActive == true  && x.SecretKey != null)
              .Select(a => new UserTwoFactorDto
              {
                  EmpId = a.EmpId,
                  CreatedAt = a.CreatedAt,
                  Id = a.Id,
                  IsEnabled = a.IsEnabled,
                  SecretKey = a.SecretKey,
                  UpdatedAt = a.UpdatedAt,

              })
              .FirstOrDefaultAsync();

        }

        public async Task<(int result, string errorMessage)> saveTwoFactorDetails(UserTwoFactorDto user)
        {
            try
            {
                var existing = await _context.UserTwoFactors
                       .FirstOrDefaultAsync(x =>
                           x.EmpId == user.EmpId &&
                          
                           x.IsActive == true);

                if (existing == null)
                {
                    await _context.UserTwoFactors.AddAsync(new UserTwoFactor
                    {
                        EmpId = user.EmpId,
                        IsEnabled = true,
                        IsActive = true,
                        SecretKey = user.SecretKey,
                        CreatedAt = DateTime.Now
                    });
                }
                else
                {
                    existing.SecretKey = user.SecretKey;
                    existing.UpdatedAt = DateTime.Now;
                }

                await _context.SaveChangesAsync();
                return (1, "User secret key stored");
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public async Task<(int result, string errorMessage)> updateTwoFactor(UserTwoFactorDto user)
        {
            try
            {
                var existing = await _context.UserTwoFactors
                       .FirstOrDefaultAsync(x =>
                           x.EmpId == user.EmpId &&
                           x.IsActive == true);


                if (existing != null)
                {
                    existing.IsEnabled = true;
                    existing.UpdatedAt = DateTime.Now;
                }

                await _context.SaveChangesAsync();
                return (1, "User secret key stored");
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public async Task<(int result, string errorMessage, RegistrationDto? user)> validateLogin(RegistrationDto user)
        {
            var result = await _context.Registrations.FirstOrDefaultAsync(x => x.Email == user.Email && x.IsActive == true);

            if (result == null || result is null)
            {
                return (0, "User not found", null);
            }

            if (result.Password == user.Password)
            {
                var userDto = new RegistrationDto
                {
                    EmpId = result.EmpId,
                    Email = result.Email,
                    Mobile=result.Mobile,
                    RoleId=result.RoleId,
                    
                    // ❌ do NOT return password
                };

                return (1, "Login Success", userDto);

            }
            else
            {
                return (0, "Invalid Credentials", null);
            }
        }
    }
}
