using DomainLayer.Data;
using DomainLayer.Data.Models;
using DtoLayer;
using RepositoryLayer.MasterRepo.Interface;
using Microsoft.EntityFrameworkCore;



namespace RepositoryLayer.MasterRepo.Repository
{
    
    public class CategoryMasterRepo(AppDbContext _context) : ICategoryMasterRepo
    {
        public async Task<(bool result, string message)> deleteProgram(int? id, int createdBy)
        {
            var category = await _context.CategoryMasters.FirstOrDefaultAsync(x=>x.Id==id && x.IsActive==true);

            

            if (category == null)
            {
                return (false, "Category not found");
            }
            else
            {
                category.IsActive = false;
                category.CreatedBy= createdBy;
                category.DeletedDate= DateTime.Now;
                category.LastModify = "D";

                await _context.SaveChangesAsync();
                return (true, "Category deleted successfully");
            }
        }

        public async Task<List<CategoryMasterDto>> fetchAllAsync()
        {
            return await _context.CategoryMasters.Where(x => x.IsActive == true).Select(x => new CategoryMasterDto
            {
                Id = x.Id,
                Name = x.Name,
                Code = x.Code,
                CreatedBy = x.CreatedBy,
                IsActive=x.IsActive
            }).ToListAsync();
        }

        public async Task<CategoryMasterDto> fetchAsyncById(int? id)
        {
            return await _context.CategoryMasters.Where(x => x.Id == id && x.IsActive == true).Select(x => new CategoryMasterDto
            {
                Id = x.Id,
                Name = x.Name,
                Code = x.Code,
                CreatedBy = x.CreatedBy,
                IsActive = x.IsActive
            }).FirstOrDefaultAsync();   
        }

        public async Task<List<CategoryMasterDto>> getAllCategoryList()
        {
            return await _context.CategoryMasters.Where(x => x.IsActive == true).Select(x=> new CategoryMasterDto { 
                Id=x.Id,
                Name=x.Name,
                Code=x.Code,
                CreatedBy=x.CreatedBy,
                IsActive=x.IsActive

            }).ToListAsync();

        }

        public async Task<ApiResponse> SaveOrUpdateAsync(CategoryMasterDto master)
        {
            var errors = new Dictionary<string, string>();

            // 1️⃣ Check ACTIVE duplicate (same name or code)
            if (await _context.CategoryMasters.AnyAsync(x =>
                x.Id != master.Id &&
                x.IsActive == true &&
                (x.Name == master.Name || x.Code == master.Code)))
            {
                if (await _context.ProgramMasters.AnyAsync(x =>
                    x.Name == master.Name &&
                    x.Id != master.Id &&
                    x.IsActive == true))
                {
                    errors["categoryName"] = "Category name already exists.";
                }

                if (await _context.ProgramMasters.AnyAsync(x =>
                    x.Code == master.Code &&
                    x.Id != master.Id &&
                    x.IsActive == true))
                {
                    errors["categoryCode"] = "Category code already exists.";
                }

                return new ApiResponse
                {
                    Success = false,
                    Errors = errors
                };
            }

                 

            // 1️⃣ Check if updating existing active record by Id
            var existingById = await _context.CategoryMasters
                .FirstOrDefaultAsync(x => x.Id == master.Id);

            if (existingById == null)
            {
                // 2️⃣ Check if same Name & Code exists but soft deleted
                existingById = await _context.CategoryMasters
                   .FirstOrDefaultAsync(x =>
                       x.Name == master.Name &&
                       x.Code == master.Code &&
                       x.IsActive == false);

            }

            if (existingById == null)
            { 
                _context.CategoryMasters.Add(new CategoryMaster
                {
                    Name = master.Name,
                    Code = master.Code,
                    LastModify = "I",
                    CreatedDate = DateTime.Now,  
                    IsActive = true,
                    CreatedBy = master.CreatedBy
                });

                await _context.SaveChangesAsync();
                return new ApiResponse
                {
                    Success = true,
                    Message = "Category Created Successfully"
                };
            }

            else
            {
                // 5️⃣ Reactivate or Update
                existingById.Name = master.Name;
                existingById.Code = master.Code;
                existingById.UpdateDate = DateTime.Now;
                existingById.LastModify = existingById.Id == master.Id ? "U" : "R"; // R = Reactivate
                existingById.IsActive = true;

                await _context.SaveChangesAsync();

                return new ApiResponse
                {
                    Success = true,
                    Message = existingById.Id == master.Id
                        ? "Category Updated Successfully"
                        : "Category Reactivated Successfully"
                };
            }
        }

    }
}
