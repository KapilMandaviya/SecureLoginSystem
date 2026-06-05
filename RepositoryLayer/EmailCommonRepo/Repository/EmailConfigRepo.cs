using DomainLayer.Data;
using DomainLayer.Data.Models;
using DtoLayer;
using RepositoryLayer.EmailCommonRepo.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.EmailCommonRepo.Repository
{
    public class EmailConfigRepo : IEmailConfigRepo
    {
        private readonly AppDbContext _context;
        public EmailConfigRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task<EmailMasterDto> GetEmailConfigValueAsync()
        {
            return await _context.EmailMasters.Where(x=>x.IsActive ==true)
                .Select(e => new EmailMasterDto
                {
                    EmailId = e.EmailId,
                    AppPassword = e.AppPassword,
                    Email = e.Email,
                    SmtpPort = e.SmtpPort,
                    SmtpServer = e.SmtpServer,
                    CreatedDate = e.CreatedDate,
                    IsActive = e.IsActive,
                    CreatedBy = e.CreatedBy,
                }).FirstOrDefaultAsync();
        }

        public async Task<(bool result, string message)> SaveOrUpdateEmailConfigAsync(EmailMasterDto settings)
        {
            try
            {
                var result = await _context.EmailMasters.Where(x => x.EmailId == settings.EmailId && x.IsActive == true).FirstOrDefaultAsync();

                if (result == null)
                {
                    await _context.EmailMasters.AddAsync(new EmailMaster
                    {
                        SmtpServer = settings.SmtpServer,
                        SmtpPort = settings.SmtpPort,
                        Email = settings.Email,
                        AppPassword = settings.AppPassword,
                        IsActive = true,
                        CreatedBy = settings.CreatedBy,
                        CreatedDate = DateTime.Now,
                        LastModify = "I"
                    });
                    await _context.SaveChangesAsync();

                    return (true, "Email configuration saved successfully");
                }
                else
                {
                    result.SmtpServer = settings.SmtpServer;
                    result.SmtpPort = settings.SmtpPort;
                    result.Email = settings.Email;
                    result.AppPassword = settings.AppPassword;
                    result.UpdateDate = DateTime.Now;
                    result.LastModify = "U";
                    result.CreatedBy = settings.CreatedBy;

                    await _context.SaveChangesAsync();
                    return (true, "Email configuration updated successfully");
                }
            }
            catch (Exception ex)
            {
                return (false, "Something went wrong!"); ;
            }
        }

    }
}
