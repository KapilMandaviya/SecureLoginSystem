using DomainLayer.Data;
using DomainLayer.Data.Models;
using DtoLayer;
using RepositoryLayer.AdmissionConfiguration.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.AdmissionConfiguration.Repository
{
    public class RegistrationVerificationRepo : IRegistrationVerificationRepo
    {
        private readonly AppDbContext _context;
        public RegistrationVerificationRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task<RegistrationVerificationDto> fetchAllAsync()
        {
            return await _context.RegistrationVerificationSettings.AsNoTracking().Select(x => new RegistrationVerificationDto
            {
                Id =x.Id,
                AutoExpireEnabled = x.AutoExpireEnabled,
                EmailOtpAttempts = x.EmailOtpAttempts,
                EmailOtpExpiration = x.EmailOtpExpiration,
                EmailOtpReset = x.EmailOtpReset,
                EmailOtpRequired = x.EmailOtpRequired,
                IsActive = x.IsActive,
                MobileOtpAttempts = x.MobileOtpAttempts,
                MobileOtpExpiration = x.MobileOtpExpiration,
                MobileOtpReset = x.MobileOtpReset,
                MobileOtpRequired = x.MobileOtpRequired,
                CreatedBy=x.CreatedBy
                
                
            }).FirstOrDefaultAsync();
        }

        public async Task<(bool result, string message)> SaveOrUpdateAsync(RegistrationVerificationDto settings)
        {
            var entity =await _context.RegistrationVerificationSettings.Where(x=>x.Id==settings.Id).FirstOrDefaultAsync();

            if (entity != null)
            {
                entity.MobileOtpAttempts = settings.MobileOtpAttempts;
                entity.MobileOtpExpiration = settings.MobileOtpExpiration;
                entity.MobileOtpReset = settings.MobileOtpReset;
                entity.MobileOtpRequired = settings.MobileOtpRequired;
                entity.EmailOtpAttempts = settings.EmailOtpAttempts;
                entity.EmailOtpExpiration = settings.EmailOtpExpiration;
                entity.EmailOtpReset = settings.EmailOtpReset;
                entity.EmailOtpRequired = settings.EmailOtpRequired;
                entity.AutoExpireEnabled = settings.AutoExpireEnabled;
                entity.IsActive = true;
                entity.CreatedBy = settings.CreatedBy;
                entity.UpdateDate = DateTime.Now;

                entity.LastModify = "U";
                
                _context.RegistrationVerificationSettings.Update(entity);

                await _context.SaveChangesAsync();

                return(true, "Settings updated successfully.");

            }
            else
            {
                var newEntity = new RegistrationVerificationSetting
                {
                    MobileOtpAttempts = settings.MobileOtpAttempts,
                    MobileOtpExpiration = settings.MobileOtpExpiration,
                    MobileOtpReset = settings.MobileOtpReset,
                    MobileOtpRequired = settings.MobileOtpRequired,
                    EmailOtpAttempts = settings.EmailOtpAttempts,
                    EmailOtpExpiration = settings.EmailOtpExpiration,
                    EmailOtpReset = settings.EmailOtpReset,
                    EmailOtpRequired = settings.EmailOtpRequired,
                    AutoExpireEnabled = settings.AutoExpireEnabled,
                    IsActive = true,
                    CreatedBy = settings.CreatedBy,
                    CreatedDate = DateTime.Now,
                    LastModify = "I",
                    
                };
                await _context.AddAsync(newEntity);

                await _context.SaveChangesAsync();
                return (true, "Settings saved successfully.");


            }
        }
    }
}
