using System;
using System.Collections.Generic;
using DomainLayer.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace DomainLayer.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AcademicYear> AcademicYears { get; set; }

    public virtual DbSet<ActionMaster> ActionMasters { get; set; }

    public virtual DbSet<AuthenticationSetting> AuthenticationSettings { get; set; }

    public virtual DbSet<CategoryMaster> CategoryMasters { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<EmailLoginOtp> EmailLoginOtps { get; set; }

    public virtual DbSet<EmailMaster> EmailMasters { get; set; }

    public virtual DbSet<FormMaster> FormMasters { get; set; }

    public virtual DbSet<MobileLoginOtp> MobileLoginOtps { get; set; }

    public virtual DbSet<ModuleDetail> ModuleDetails { get; set; }

    public virtual DbSet<NotificationTemplate> NotificationTemplates { get; set; }

    public virtual DbSet<PasswordRule> PasswordRules { get; set; }

    public virtual DbSet<PaymentSetting> PaymentSettings { get; set; }

    public virtual DbSet<ProgramMaster> ProgramMasters { get; set; }

    public virtual DbSet<QuotaMaster> QuotaMasters { get; set; }

    public virtual DbSet<Registration> Registrations { get; set; }

    public virtual DbSet<RegistrationVerificationSetting> RegistrationVerificationSettings { get; set; }

    public virtual DbSet<RoleFormsPermission> RoleFormsPermissions { get; set; }

    public virtual DbSet<RoleMaster> RoleMasters { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<UserTwoFactor> UserTwoFactors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AcademicYear>(entity =>
        {
            entity.ToTable("Academic_year");

            entity.HasIndex(e => new { e.Id, e.IsActive }, "IX_AcademicYear_Active");

            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.CurrentAcYear)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Current_ac_year");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.EndDate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("End_date");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.StartDate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Start_date");
            entity.Property(e => e.StatusAc).HasColumnName("Status_ac");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<ActionMaster>(entity =>
        {
            entity.ToTable("ActionMaster");

            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.Name)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<AuthenticationSetting>(entity =>
        {
            entity.HasKey(e => e.AuthSettingId).HasName("PK__Authenti__E79D42AEE48DA2D6");

            entity.HasIndex(e => e.AuthCode, "UQ__Authenti__3C31BBCF854CC5E7").IsUnique();

            entity.Property(e => e.AuthCode).HasMaxLength(50);
            entity.Property(e => e.AuthName).HasMaxLength(100);
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.IsEnabled).HasDefaultValue(true);
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.Otpattempt).HasColumnName("OTPAttempt");
            entity.Property(e => e.OtpexpiryTime).HasColumnName("OTPExpiryTime");
            entity.Property(e => e.OtpresetTime).HasColumnName("OTPResetTime");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<CategoryMaster>(entity =>
        {
            entity.ToTable("CategoryMaster");

            entity.HasIndex(e => new { e.Id, e.Code }, "IX_CategoryMaster_Id_Code").IsUnique();

            entity.HasIndex(e => new { e.Id, e.Code, e.IsActive }, "IX_CategoryMaster_Id_Code_Active");

            entity.Property(e => e.Code)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.Name)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PK__City__F2D21B76D12874A2");

            entity.ToTable("City");

            entity.Property(e => e.CityName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");

            entity.HasOne(d => d.State).WithMany(p => p.Cities)
                .HasForeignKey(d => d.StateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__City__StateId__06CD04F7");
        });

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Country__3214EC07A79A1B1A");

            entity.ToTable("Country");

            entity.Property(e => e.CountryName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<EmailLoginOtp>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UserLogi__3214EC074D8D1644");

            entity.ToTable("EmailLoginOtp");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.ExpiryTime).HasColumnType("datetime");
            entity.Property(e => e.OtpHash).HasMaxLength(256);
            entity.Property(e => e.OtpType).HasMaxLength(20);
        });

        modelBuilder.Entity<EmailMaster>(entity =>
        {
            entity.HasKey(e => e.EmailId);

            entity.ToTable("EmailMaster");

            entity.Property(e => e.EmailId).HasColumnName("emailId");
            entity.Property(e => e.AppPassword)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("appPassword");
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.SmtpPort).HasColumnName("smtpPort");
            entity.Property(e => e.SmtpServer)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("smtpServer");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<FormMaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__moduleMa__3213E83F057121BD");

            entity.ToTable("formMaster", tb => tb.HasTrigger("trg_FormMaster_RoleFormPermission_ActionSync"));

            entity.HasIndex(e => e.FormCode, "UQ__moduleMa__B16D3ED5AC3CB3EA").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ActionList).IsUnicode(false);
            entity.Property(e => e.ActionName)
                .HasMaxLength(100)
                .HasColumnName("actionName");
            entity.Property(e => e.ControllerName)
                .HasMaxLength(100)
                .HasColumnName("controller_name");
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.FormCode)
                .HasMaxLength(200)
                .HasColumnName("formCode");
            entity.Property(e => e.FormIcon)
                .HasMaxLength(200)
                .HasColumnName("formIcon");
            entity.Property(e => e.FormName)
                .HasMaxLength(200)
                .HasColumnName("formName");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.IsMenu)
                .HasDefaultValue(true)
                .HasColumnName("isMenu");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.MenuOrder).HasColumnName("menuOrder");
            entity.Property(e => e.MenuType)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("menuType");
            entity.Property(e => e.ModuleId).HasColumnName("moduleId");
            entity.Property(e => e.ParentId).HasColumnName("parentId");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<MobileLoginOtp>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MobileLo__3214EC073986DA3D");

            entity.ToTable("MobileLoginOtp");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.ExpiryTime).HasColumnType("datetime");
            entity.Property(e => e.Mobile).HasMaxLength(256);
            entity.Property(e => e.OtpHash).HasMaxLength(256);
            entity.Property(e => e.OtpType).HasMaxLength(20);
        });

        modelBuilder.Entity<ModuleDetail>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.Name)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<NotificationTemplate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Notifica__3214EC070F5DD1B1");

            entity.ToTable("NotificationTemplate");

            entity.HasIndex(e => new { e.EventCode, e.Channel }, "UQ_Event_Channel").IsUnique();

            entity.Property(e => e.Channel).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.EventCode).HasMaxLength(150);
            entity.Property(e => e.EventName).HasMaxLength(150);
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<PasswordRule>(entity =>
        {
            entity.HasKey(e => e.RuleId).HasName("PK__Password__110458E2A0598615");

            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.RuleCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RuleName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<PaymentSetting>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PaymentS__3213E83FE660F7C0");

            entity.ToTable("PaymentSetting");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ApplicationFee)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("applicationFee");
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.GatewayProvider)
                .HasMaxLength(255)
                .HasColumnName("gatewayProvider");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.MerchantKey)
                .HasMaxLength(255)
                .HasColumnName("merchantKey");
            entity.Property(e => e.PaymentTiming)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("after_kyc")
                .HasColumnName("paymentTiming");
            entity.Property(e => e.RefundableFee).HasColumnName("refundableFee");
            entity.Property(e => e.RetryAttempts)
                .HasDefaultValue(3)
                .HasColumnName("retryAttempts");
            entity.Property(e => e.TestMode).HasColumnName("testMode");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<ProgramMaster>(entity =>
        {
            entity.ToTable("ProgramMaster");

            entity.HasIndex(e => new { e.Id, e.IsActive }, "IX_ProgramMaster_Active");

            entity.Property(e => e.Code)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DegreeId).HasColumnName("degreeId");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<QuotaMaster>(entity =>
        {
            entity.ToTable("QuotaMaster");

            entity.HasIndex(e => new { e.Id, e.IsActive }, "IX_QuotaMaster_Active");

            entity.Property(e => e.Code).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.Name)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<Registration>(entity =>
        {
            entity.HasKey(e => e.EmpId);

            entity.ToTable("Registration", tb => tb.HasTrigger("Trigger_Update_Registration"));

            entity.HasIndex(e => new { e.EmpId, e.EmpName, e.CityId, e.City, e.IsDelete, e.IsActive, e.RoleId, e.FcId, e.DesigId, e.EmpCode, e.EmpStatus, e.MergeStatus, e.CollegeId, e.PrimaryEmpId }, "idx_Registration");

            entity.Property(e => e.Address).IsUnicode(false);
            entity.Property(e => e.Birthdate)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CityId).HasColumnName("City_id");
            entity.Property(e => e.CollegeId).HasColumnName("College_id");
            entity.Property(e => e.DeleteDate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Delete_date");
            entity.Property(e => e.DesigId).HasColumnName("Desig_id");
            entity.Property(e => e.DisciId)
                .IsUnicode(false)
                .HasColumnName("Disci_id");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmpCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Emp_code");
            entity.Property(e => e.EmpName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Emp_name");
            entity.Property(e => e.EmpStatus)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.FcId).HasColumnName("Fc_id");
            entity.Property(e => e.FormName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.InsertDate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Insert_date");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IP_address");
            entity.Property(e => e.IsActiveRemark)
                .IsUnicode(false)
                .HasColumnName("IsActive_Remark");
            entity.Property(e => e.IsDelete)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Is_delete");
            entity.Property(e => e.MergeStatus).HasColumnName("merge_status");
            entity.Property(e => e.Mobile)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Note)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Pincode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PrimaryEmpId).HasColumnName("Primary_Emp_Id");
            entity.Property(e => e.RoleId).HasColumnName("Role_id");
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UId).HasColumnName("U_id");
            entity.Property(e => e.UpdateDate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Update_date");
        });

        modelBuilder.Entity<RegistrationVerificationSetting>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Registra__3213E83FB50EE024");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AutoExpireEnabled).HasColumnName("autoExpireEnabled");
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.EmailOtpAttempts).HasColumnName("emailOtpAttempts");
            entity.Property(e => e.EmailOtpExpiration).HasColumnName("emailOtpExpiration");
            entity.Property(e => e.EmailOtpRequired).HasColumnName("emailOtpRequired");
            entity.Property(e => e.EmailOtpReset).HasColumnName("emailOtpReset");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.MobileOtpAttempts).HasColumnName("mobileOtpAttempts");
            entity.Property(e => e.MobileOtpExpiration).HasColumnName("mobileOtpExpiration");
            entity.Property(e => e.MobileOtpRequired).HasColumnName("mobileOtpRequired");
            entity.Property(e => e.MobileOtpReset).HasColumnName("mobileOtpReset");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<RoleFormsPermission>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__role_mod__3213E83F174D77C4");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CanView).HasColumnName("can_View");
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.FormId).HasColumnName("formId");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.ModuleId).HasColumnName("moduleId");
            entity.Property(e => e.PermissionKey)
                .IsUnicode(false)
                .HasColumnName("permissionKey");
            entity.Property(e => e.RoleId).HasColumnName("roleId");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<RoleMaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__roleMast__3213E83F5A3AA68A");

            entity.ToTable("RoleMaster");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.PriorityOrder).HasColumnName("priorityOrder");
            entity.Property(e => e.RoleName)
                .HasMaxLength(100)
                .HasColumnName("roleName");
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");
        });

        modelBuilder.Entity<State>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__State__3214EC070DFF1E7D");

            entity.ToTable("State");

            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.DeletedDate)
                .HasColumnType("datetime")
                .HasColumnName("deletedDate");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.LastModify)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("lastModify");
            entity.Property(e => e.StateName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.UpdateDate)
                .HasColumnType("datetime")
                .HasColumnName("updateDate");

            entity.HasOne(d => d.Country).WithMany(p => p.States)
                .HasForeignKey(d => d.CountryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__State__CountryId__07C12930");
        });

        modelBuilder.Entity<UserTwoFactor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UserTwoF__3214EC07BE89A8F1");

            entity.ToTable("UserTwoFactor");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsEnabled).HasDefaultValue(false);
            entity.Property(e => e.SecretKey).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
