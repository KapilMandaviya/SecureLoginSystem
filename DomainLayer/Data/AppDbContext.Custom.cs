
using DomainLayer.Data.SP_DataModal;

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Data
{
    public partial class AppDbContext
    {

        //SP_getAllMenuSubMenuList is used to fetch Role Menu with Permissions for Role Management  
        public virtual DbSet<SP_RoleMenuFieldDto> RoleMenuFieldDtos { get; set; }
        public virtual DbSet<SP_UserRolePermissionDto> RolePermissionDtos { get; set; }
        public virtual DbSet<SP_CollegeSeatTotalDto> _CollegeSeatTotalDtos { get; set; }
        public virtual DbSet<SP_CollegeMasterDto> SPCollegeMasterDtos { get; set; }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SP_RoleMenuFieldDto>().HasNoKey().ToView(null); // No table mapping, just for queries
            modelBuilder.Entity<SP_UserRolePermissionDto>().HasNoKey().ToView(null); // No table mapping, just for queries
            modelBuilder.Entity<SP_CollegeSeatTotalDto>().HasNoKey().ToView(null); // No table mapping, just for queries
            modelBuilder.Entity<SP_CollegeMasterDto>().HasNoKey().ToView(null); // No table mapping, just for queries
        }

    }
}