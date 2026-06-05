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
    public class NotificationTemplatRepo : INotificationTemplatRepo
    {
        private readonly AppDbContext _context;
        public NotificationTemplatRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task<(bool result, string message)> deleteAsync(int? id, int? createdBy)
        {
            var notification = await _context.NotificationTemplates.FirstOrDefaultAsync(x => x.Id == id && x.IsActive == true);


            if (notification == null)
            {
                return (false, "Notification template not found");
            }
            else
            {
                notification.IsActive = false;
                notification.CreatedBy = createdBy;
                notification.DeletedDate = DateTime.Now;
                notification.LastModify = "D";

                await _context.SaveChangesAsync();
                return (true, "Notification template deleted successfully");
            }
        }

        public async Task<List<NotificationTemplateDto>> fetchAllAsync()
        {
            return await _context.NotificationTemplates.Where(x => x.IsActive == true).Select(x => new NotificationTemplateDto
            {
                Id = x.Id,
                EventCode = x.EventCode,
                EventName = x.EventName,
                Channel = x.Channel,
                Subject = x.Subject,
                Body = x.Body,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy
                
            }).ToListAsync();
        }

        public async Task<NotificationTemplateDto> getById(int? Id)
        {
            return await _context.NotificationTemplates.Where(x => x.Id == Id && x.IsActive == true).Select(x => new NotificationTemplateDto
            {
                Id = x.Id,
                EventCode = x.EventCode,
                EventName = x.EventName,
                Channel = x.Channel,
                Subject = x.Subject,
                Body = x.Body,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy
                
            }).FirstOrDefaultAsync();
        }

        public async Task<ApiResponse> SaveOrUpdateAsync(NotificationTemplateDto model)
        {
            try
            {

                var errors = new Dictionary<string, string>();

                if (await _context.NotificationTemplates.AnyAsync(x =>
                    x.Channel.ToUpper() == model.Channel.ToUpper() && x.EventCode== model.EventCode  && x.Id != model.Id && x.IsActive == true))
                    errors["code"] = "This event code already exist for this channel";

                var validChannels = new[] { "SMS", "EMAIL", "WHATSAPP" };

                if (!validChannels.Contains(model.Channel?.ToUpper()))
                {
                    errors["channel"] = "Invalid channel. Only SMS, EMAIL, WHATSAPP are allowed.";
                }


                if (errors.Any())
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Errors = errors
                    };
                }

                // 🔹 GET OR CREATE MAIN ENTITY
                var entity = await _context.NotificationTemplates
                    .FirstOrDefaultAsync(x => x.Id == model.Id && x.IsActive==true);

                if (entity == null)
                {
                    entity = new NotificationTemplate();
                    entity.CreatedDate = DateTime.Now;
                    entity.LastModify = "I";
                    _context.NotificationTemplates.Add(entity);
                }

                // 🔹 UPDATE MAIN TABLE
                entity.EventCode = model.EventCode;
                entity.EventName = model.EventName;
                entity.Channel = model.Channel ?? "";
                entity.Subject = model.Subject;
                entity.Body = model.Body;
                entity.LastModify = "U";
                entity.DeletedDate = null;  
                entity.UpdateDate = DateTime.Now;
                entity.CreatedBy = model.CreatedBy;
                entity.IsActive = true;

                await _context.SaveChangesAsync(); // 🔥 ensure ID

                return new ApiResponse { Success = true, Message = "Notification Template saved successfully." };
            }
            catch (Exception ex)
            {

                return new ApiResponse
                {
                    Success = false,
                    Message = "Something went wrong"
                };
            }
        }
    }
}
