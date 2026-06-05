using DomainLayer.Data;
using DomainLayer.Data.Models;
using DtoLayer;
using RepositoryLayer.MasterRepo.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer.MasterRepo.Repository
{
    public class AcademicYearRepo : IAcademicYearRepo
    {
        private readonly AppDbContext _context;

        public AcademicYearRepo(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<AcadamicYearDto>> fetchAllAsync()
        {
            return await _context.AcademicYears.Where(x => x.IsActive == true).Select(x=> new AcadamicYearDto{ 
                Id=x.Id,
                StartDate=x.StartDate,
                EndDate=x.EndDate,
                CurrentAcYear=x.CurrentAcYear,
                StatusAc=x.StatusAc,
                IsProcessed=x.IsProcessed,
                IsActive= x.IsActive
            
            }).ToListAsync();
        }

        public async Task<AcadamicYearDto> fetchAsyncById(int? id)
        {
            return await _context.AcademicYears.Where(x => x.IsActive == true && x.StatusAc==true && x.Id==id).Select(x => new AcadamicYearDto
            {
                Id = x.Id,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                CurrentAcYear = x.CurrentAcYear,
                StatusAc = x.StatusAc,
                IsProcessed = x.IsProcessed,
                IsActive = x.IsActive

            }).FirstOrDefaultAsync();
        }

        public async Task<AcadamicYearDto> GetCurrentAcademicYearAsync()
        {
            return await _context.AcademicYears.Where(x => x.IsActive == true && x.StatusAc == true && x.IsProcessed==true).Select(x => new AcadamicYearDto { 
                Id=x.Id,
                CurrentAcYear = x.CurrentAcYear ,
                StatusAc = x.StatusAc,  

            }).FirstOrDefaultAsync();
        }

        public async Task<(bool result, string message)> makeActiveYear(int? id,int createdBy)
        {
            var activeYear = await _context.AcademicYears.FirstOrDefaultAsync(x => x.Id == id && x.IsActive==true);
            if (activeYear == null)
            {
                return (false, "Academic Year not found");
            }
            else
            {
                if (activeYear.IsProcessed == true || activeYear.StatusAc==true)
                {
                    return (false, "Academic year has already been processed.");
                }
            }

            var result = await _context.AcademicYears.FirstOrDefaultAsync(x => x.Id == id && x.IsProcessed == false
            && x.StatusAc == false && x.IsActive == true);

            if (result != null)
            {
                result.StatusAc = true;
                result.IsProcessed = true;
                result.UpdateDate = DateTime.Now;
                result.LastModify = "P";
                result.CreatedBy = createdBy;

                await _context.SaveChangesAsync();

                // 🔥 1️⃣ Make all other years inactive
                var otherYears = await _context.AcademicYears
                    .Where(x => x.Id != id && x.IsActive == true && x.StatusAc == true)
                    .ToListAsync();

                foreach (var year in otherYears)
                {
                    year.StatusAc = false;
                    year.UpdateDate = DateTime.Now;
                    year.LastModify = "U";
                    year.CreatedBy = createdBy;    
                }

                await _context.SaveChangesAsync();
                return (true, "Academic Year Active successfully.");


            }
            else
            {
                return (false, "Academic Year not found");
            }
            

        }

        public async Task<ApiResponse> SaveOrUpdateAsync(AcadamicYearDto master)
        {
            var result = await _context.AcademicYears.FirstOrDefaultAsync(x => x.Id == master.Id && x.IsActive==true);

            if (result == null)
            {
                await _context.AcademicYears.AddAsync(new AcademicYear
                {
                    StartDate = master.StartDate,
                    EndDate = master.EndDate,
                    CurrentAcYear = master.CurrentAcYear,
                    StatusAc = false,
                    IsProcessed = false,
                    IsActive = false,
                    CreatedBy = master.CreatedBy,
                    CreatedDate = DateTime.Now,
                    LastModify = "I",

                });

                await _context.SaveChangesAsync();
                return new ApiResponse { Success = true, Message = "Academic Year added successfully." };
            }
            else
            {
                if (result != null && result.StatusAc == true && result.IsActive == true)
                {
                    result.StartDate = master.StartDate;
                    result.EndDate = master.EndDate;
                    result.CurrentAcYear = master.CurrentAcYear;
                    result.StatusAc = master.StatusAc;
                    result.IsProcessed = master.IsProcessed;
                    result.IsActive = true;
                    result.UpdateDate = DateTime.Now;
                    result.CreatedBy = master.CreatedBy;
                    result.LastModify = "U";


                    
                }
                await _context.SaveChangesAsync();
                return new ApiResponse { Success = true, Message = "Academic Year updated successfully." };
            }


        }
    }
}
