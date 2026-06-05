using DomainLayer.Data;
using DomainLayer.Data.Models;
using DtoLayer;
using RepositoryLayer.SuperAdminRepo.Interface;
using Microsoft.EntityFrameworkCore;


namespace RepositoryLayer.SuperAdminRepo.Repository
{
    public class SAAuthSetting : ISAAuthSetting
    {
        private readonly AppDbContext _context;
        public SAAuthSetting(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AuthenticationSettingDto>> fetchAllAsync()
        {
            return await _context.AuthenticationSettings.Where(x=>x.IsActive == true).Select(x => new AuthenticationSettingDto
            {
                Otpattempt = x.Otpattempt,
                AuthCode = x.AuthCode,
                AuthName = x.AuthName,
                AuthSettingId = x.AuthSettingId,
                IsActive = x.IsActive,
                OtpresetTime = x.OtpresetTime,
                OtpexpiryTime=x.OtpexpiryTime,
                IsEnabled = x.IsEnabled,
                CreatedBy = x.CreatedBy,

            }).ToListAsync();
        }

        public async Task<AuthenticationSettingDto> fetchAllAsyncByAuthCode(string? authCode)
        {
            return await _context.AuthenticationSettings.Where(x => x.AuthCode == authCode && x.IsEnabled == true && x.IsActive==true).Select(x => new AuthenticationSettingDto
            {
                Otpattempt = x.Otpattempt,
                AuthCode = x.AuthCode,
                AuthName = x.AuthName,
                AuthSettingId = x.AuthSettingId,
                IsActive = x.IsActive,
                OtpresetTime = x.OtpresetTime,
                OtpexpiryTime = x.OtpexpiryTime,
                IsEnabled = x.IsEnabled,
                CreatedBy = x.CreatedBy,

            }).FirstOrDefaultAsync();
        }

        public async Task<List<PasswordRuleSettingDto>> fetchAllPasswordRulesAsync()
        {
            return await _context.PasswordRules.Where(x => x.IsActive==true).OrderBy(x => x.RuleId)
                .Select(x => new PasswordRuleSettingDto
                {
                    IsEnabled = x.IsEnabled,
                    RuleCode = x.RuleCode,
                    RuleId = x.RuleId,
                    RuleValue = x.RuleValue,
                    

                }).ToListAsync();
        }

        
        public async Task<(bool result, string message)> SaveOrUpdateAsync(List<AuthenticationSettingDto> settings)
        {
            try
            {
                var ids = settings
               .Where(x => x.AuthSettingId > 0)
               .Select(x => x.AuthSettingId)
               .ToList();

                var existingRecords = await _context.AuthenticationSettings
                    .Where(x => ids.Contains(x.AuthSettingId) && x.IsActive==true)
                    .ToListAsync();

                foreach (var dto in settings)
                {
                    var entity = existingRecords
                   .FirstOrDefault(x => x.AuthSettingId == dto.AuthSettingId && x.IsActive == true);

                    if (entity != null)
                    {
                        // 🔄 UPDATE
                        entity.AuthCode = dto.AuthCode;
                        ;
                        entity.IsEnabled = dto.IsEnabled;
                        entity.Otpattempt = dto.Otpattempt;
                        entity.OtpresetTime = dto.OtpresetTime;
                        entity.OtpexpiryTime = dto.OtpexpiryTime;
                        entity.CreatedBy = dto.CreatedBy;
                        entity.UpdateDate = DateTime.Now;
                        entity.LastModify = "U";
                    }
                    else
                    {
                        // ➕ INSERT
                        await _context.AuthenticationSettings.AddAsync(new AuthenticationSetting
                        {
                            AuthCode = dto.AuthCode,
                            AuthName = dto.AuthName,
                            IsEnabled = dto.IsEnabled,
                            Otpattempt = dto.Otpattempt,
                            OtpresetTime = dto.OtpresetTime,
                            OtpexpiryTime=dto.OtpexpiryTime,
                            IsActive = dto.IsActive ?? true,
                            CreatedBy = dto.CreatedBy   ,
                            CreatedDate= DateTime.Now,
                           LastModify = "I"

                        });
                    }


                }

                await _context.SaveChangesAsync();
                return (true, "Authentication settings saved successfully");
            }
            catch (Exception ex)
            {

                return (false, "Something went wrong!"); ;
            }
        }

    
        public async Task<(bool result, string message)> SaveOrUpdatePasswordRulesAsync(List<PasswordRuleSettingDto> rules)
        {
            try
            {
                var codes = rules.Select(x => x.RuleId).ToList();

                var dbRules = await _context.PasswordRules
                    .Where(x => codes.Contains(x.RuleId) && x.IsActive == true)
                    .ToListAsync();

                foreach (var rule in rules)
                {
                    var entity = dbRules.FirstOrDefault(x => x.RuleId == rule.RuleId);

                    if (entity != null)
                    {
                        // 🔄 UPDATE
                        entity.IsEnabled = rule.IsEnabled;
                        entity.UpdateDate = DateTime.Now;
                        entity.LastModify = "U";
                        entity.CreatedBy = rule.CreatedBy;  
                        
                    }
                    //else
                    //{
                    //    // ➕ INSERT
                    //    await _context.PasswordRules.AddAsync(new PasswordRule
                    //    {
                    //        RuleCode = rule.RuleCode,
                    //        RuleName = rule.RuleName,
                    //        IsEnabled = rule.IsEnabled,
                    //        RuleValue = rule.RuleValue,
                    //        IsActive = true,
                    //        CreatedOn = DateTime.Now
                    //    });
                    //}
                }

                await _context.SaveChangesAsync();
                return (true, "Password Rules saved successfully");
            }
            catch (Exception ex)
            {

                return (false, "Something went wrong!"); ;
            }
        }
    }
}