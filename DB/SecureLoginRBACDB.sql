USE [master]
GO
/****** Object:  Database [SecureLoginRBAC]    Script Date: 05-06-2026 14:19:46 ******/
CREATE DATABASE [SecureLoginRBAC]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'SecureLoginRBAC', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\SecureLoginRBAC.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'SecureLoginRBAC_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\SecureLoginRBAC_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [SecureLoginRBAC] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [SecureLoginRBAC].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [SecureLoginRBAC] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET ARITHABORT OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [SecureLoginRBAC] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [SecureLoginRBAC] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET  DISABLE_BROKER 
GO
ALTER DATABASE [SecureLoginRBAC] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [SecureLoginRBAC] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [SecureLoginRBAC] SET  MULTI_USER 
GO
ALTER DATABASE [SecureLoginRBAC] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [SecureLoginRBAC] SET DB_CHAINING OFF 
GO
ALTER DATABASE [SecureLoginRBAC] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [SecureLoginRBAC] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [SecureLoginRBAC] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [SecureLoginRBAC] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [SecureLoginRBAC] SET QUERY_STORE = OFF
GO
USE [SecureLoginRBAC]
GO
/****** Object:  UserDefinedTableType [dbo].[DocumentSettingType]    Script Date: 05-06-2026 14:19:47 ******/
CREATE TYPE [dbo].[DocumentSettingType] AS TABLE(
	[Id] [int] NULL,
	[DocumentName] [nvarchar](200) NULL,
	[IsMandatory] [bit] NULL,
	[CreatedBy] [int] NULL
)
GO
/****** Object:  UserDefinedTableType [dbo].[Type_RolePermissionList]    Script Date: 05-06-2026 14:19:47 ******/
CREATE TYPE [dbo].[Type_RolePermissionList] AS TABLE(
	[FormId] [int] NULL,
	[ActionId] [int] NULL,
	[PermissionKey] [nvarchar](200) NULL,
	[CanView] [bit] NULL,
	[IsActive] [bit] NULL,
	[CreatedBy] [int] NULL
)
GO
/****** Object:  Table [dbo].[Academic_year]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Academic_year](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Start_date] [varchar](50) NULL,
	[End_date] [varchar](50) NULL,
	[Current_ac_year] [varchar](50) NULL,
	[Status_ac] [bit] NULL,
	[IsProcessed] [bit] NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK_Academic_year] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ActionMaster]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActionMaster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](150) NOT NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK_ActionMaster] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AuthenticationSettings]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AuthenticationSettings](
	[AuthSettingId] [int] IDENTITY(1,1) NOT NULL,
	[AuthCode] [nvarchar](50) NOT NULL,
	[AuthName] [nvarchar](100) NOT NULL,
	[IsEnabled] [bit] NOT NULL,
	[OTPAttempt] [int] NULL,
	[OTPResetTime] [int] NULL,
	[OTPExpiryTime] [int] NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK__Authenti__E79D42AEE48DA2D6] PRIMARY KEY CLUSTERED 
(
	[AuthSettingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CategoryMaster]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CategoryMaster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](150) NOT NULL,
	[Code] [varchar](100) NOT NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK_CategoryMaster] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[City]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[City](
	[CityId] [int] IDENTITY(1,1) NOT NULL,
	[CityName] [varchar](100) NOT NULL,
	[StateId] [int] NOT NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[CityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Country]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Country](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CountryName] [varchar](100) NOT NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmailLoginOtp]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmailLoginOtp](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EmpId] [int] NULL,
	[Email] [nvarchar](256) NULL,
	[OtpType] [nvarchar](20) NOT NULL,
	[OtpHash] [nvarchar](256) NOT NULL,
	[ExpiryTime] [datetime] NOT NULL,
	[IsUsed] [bit] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UsedAt] [datetime2](7) NULL,
 CONSTRAINT [PK__UserLogi__3214EC074D8D1644] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmailMaster]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmailMaster](
	[emailId] [int] IDENTITY(1,1) NOT NULL,
	[email] [varchar](100) NULL,
	[appPassword] [varchar](50) NULL,
	[smtpPort] [int] NULL,
	[smtpServer] [varchar](100) NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK_EmailMaster] PRIMARY KEY CLUSTERED 
(
	[emailId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[formMaster]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[formMaster](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[moduleId] [int] NULL,
	[formName] [nvarchar](200) NOT NULL,
	[formCode] [nvarchar](200) NOT NULL,
	[formIcon] [nvarchar](200) NULL,
	[menuOrder] [int] NOT NULL,
	[controller_name] [nvarchar](100) NULL,
	[actionName] [nvarchar](100) NULL,
	[parentId] [int] NULL,
	[menuType] [varchar](100) NULL,
	[isMenu] [bit] NULL,
	[ActionList] [varchar](max) NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK__moduleMa__3213E83F057121BD] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MobileLoginOtp]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MobileLoginOtp](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EmpId] [int] NULL,
	[Mobile] [nvarchar](256) NULL,
	[OtpType] [nvarchar](20) NOT NULL,
	[OtpHash] [nvarchar](256) NOT NULL,
	[ExpiryTime] [datetime] NOT NULL,
	[IsUsed] [bit] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UsedAt] [datetime2](7) NULL,
 CONSTRAINT [PK__MobileLo__3214EC073986DA3D] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ModuleDetails]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ModuleDetails](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](150) NULL,
	[Description] [varchar](max) NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK_ModuleDetails] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NotificationTemplate]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NotificationTemplate](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EventCode] [nvarchar](150) NOT NULL,
	[EventName] [nvarchar](150) NOT NULL,
	[Channel] [nvarchar](50) NOT NULL,
	[Subject] [nvarchar](max) NULL,
	[Body] [nvarchar](max) NOT NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PasswordRules]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PasswordRules](
	[RuleId] [int] IDENTITY(1,1) NOT NULL,
	[RuleCode] [varchar](50) NOT NULL,
	[RuleName] [varchar](100) NOT NULL,
	[IsEnabled] [bit] NOT NULL,
	[RuleValue] [int] NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK__Password__110458E2A0598615] PRIMARY KEY CLUSTERED 
(
	[RuleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PaymentSetting]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PaymentSetting](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[paymentTiming] [varchar](100) NOT NULL,
	[applicationFee] [decimal](10, 2) NULL,
	[retryAttempts] [int] NOT NULL,
	[refundableFee] [bit] NOT NULL,
	[testMode] [bit] NOT NULL,
	[gatewayProvider] [nvarchar](255) NOT NULL,
	[merchantKey] [nvarchar](255) NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK__PaymentS__3213E83FE660F7C0] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProgramMaster]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProgramMaster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[degreeId] [int] NOT NULL,
	[Name] [varchar](200) NOT NULL,
	[Code] [varchar](200) NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK_ProgramMaster] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuotaMaster]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuotaMaster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](150) NULL,
	[Code] [nvarchar](50) NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK_QuotaMaster] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Registration]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Registration](
	[EmpId] [int] IDENTITY(1,1) NOT NULL,
	[Emp_name] [varchar](50) NULL,
	[Address] [varchar](max) NULL,
	[City_id] [int] NULL,
	[City] [varchar](50) NULL,
	[State] [varchar](50) NULL,
	[Pincode] [varchar](50) NULL,
	[Email] [varchar](50) NULL,
	[Password] [varchar](50) NULL,
	[Mobile] [varchar](50) NULL,
	[Birthdate] [varchar](50) NULL,
	[IP_address] [varchar](50) NULL,
	[Insert_date] [varchar](50) NULL,
	[Update_date] [varchar](50) NULL,
	[Delete_date] [varchar](50) NULL,
	[Is_delete] [varchar](50) NULL,
	[IsActive] [bit] NULL,
	[IsActive_Remark] [varchar](max) NULL,
	[U_id] [int] NULL,
	[Role_id] [int] NULL,
	[Fc_id] [int] NULL,
	[College_id] [int] NULL,
	[Desig_id] [int] NULL,
	[Emp_code] [varchar](50) NULL,
	[Note] [varchar](50) NULL,
	[FormName] [varchar](50) NULL,
	[Primary_Emp_Id] [int] NULL,
	[EmpStatus] [varchar](10) NULL,
	[merge_status] [int] NULL,
	[Disci_id] [varchar](max) NULL,
 CONSTRAINT [PK_Registration] PRIMARY KEY CLUSTERED 
(
	[EmpId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RegistrationVerificationSettings]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RegistrationVerificationSettings](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[mobileOtpRequired] [bit] NOT NULL,
	[emailOtpRequired] [bit] NOT NULL,
	[autoExpireEnabled] [bit] NOT NULL,
	[mobileOtpAttempts] [int] NULL,
	[mobileOtpReset] [int] NULL,
	[mobileOtpExpiration] [int] NULL,
	[emailOtpAttempts] [int] NULL,
	[emailOtpReset] [int] NULL,
	[emailOtpExpiration] [int] NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK__Registra__3213E83FB50EE024] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoleFormsPermissions]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoleFormsPermissions](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[roleId] [int] NOT NULL,
	[moduleId] [int] NULL,
	[formId] [int] NULL,
	[ActionId] [int] NULL,
	[permissionKey] [varchar](max) NULL,
	[can_View] [bit] NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK__role_mod__3213E83F174D77C4] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoleMaster]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoleMaster](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[roleName] [nvarchar](100) NOT NULL,
	[priorityOrder] [int] NOT NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
 CONSTRAINT [PK__roleMast__3213E83F5A3AA68A] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[State]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[State](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StateName] [varchar](100) NOT NULL,
	[CountryId] [int] NOT NULL,
	[isActive] [bit] NULL,
	[createdBy] [int] NULL,
	[createdDate] [datetime] NULL,
	[updateDate] [datetime] NULL,
	[lastModify] [char](1) NULL,
	[deletedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserTwoFactor]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserTwoFactor](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EmpId] [int] NULL,
	[SecretKey] [nvarchar](100) NULL,
	[IsEnabled] [bit] NULL,
	[IsActive] [bit] NULL,
	[CreatedAt] [datetime] NULL,
	[UpdatedAt] [datetime] NULL,
 CONSTRAINT [PK__UserTwoF__3214EC07BE89A8F1] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Academic_year] ON 

INSERT [dbo].[Academic_year] ([Id], [Start_date], [End_date], [Current_ac_year], [Status_ac], [IsProcessed], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'2025-04-01', N'2026-12-18', N'2025-2026', 0, 1, 1, 1, CAST(N'2026-02-12T12:33:26.837' AS DateTime), CAST(N'2026-02-20T15:15:19.137' AS DateTime), N'U', NULL)
INSERT [dbo].[Academic_year] ([Id], [Start_date], [End_date], [Current_ac_year], [Status_ac], [IsProcessed], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'2026-02-01', N'2027-01-01', N'2026-2027', 1, 1, 1, 1, CAST(N'2026-02-20T14:51:45.743' AS DateTime), CAST(N'2026-02-20T15:18:25.043' AS DateTime), N'U', NULL)
INSERT [dbo].[Academic_year] ([Id], [Start_date], [End_date], [Current_ac_year], [Status_ac], [IsProcessed], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (3, N'2026-03-01', N'2027-01-01', N'2026-2027', 0, 0, 0, 1, CAST(N'2026-03-20T14:23:50.180' AS DateTime), NULL, N'I', NULL)
SET IDENTITY_INSERT [dbo].[Academic_year] OFF
GO
SET IDENTITY_INSERT [dbo].[ActionMaster] ON 

INSERT [dbo].[ActionMaster] ([Id], [Name], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'CREATE', 1, 1, CAST(N'2026-02-10T10:45:59.137' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[ActionMaster] ([Id], [Name], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'UPDATE', 1, 1, CAST(N'2026-02-10T10:45:59.317' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[ActionMaster] ([Id], [Name], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (3, N'DELETE', 1, 1, CAST(N'2026-02-10T10:45:59.330' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[ActionMaster] ([Id], [Name], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (4, N'PRINT', 1, 1, CAST(N'2026-02-10T10:45:59.340' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[ActionMaster] ([Id], [Name], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (5, N'VIEW', 1, 1, CAST(N'2026-02-10T10:47:15.073' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[ActionMaster] ([Id], [Name], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (6, N'MAKEACTIVE', 1, 1, CAST(N'2026-02-12T13:36:17.240' AS DateTime), NULL, N'I', NULL)
SET IDENTITY_INSERT [dbo].[ActionMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[AuthenticationSettings] ON 

INSERT [dbo].[AuthenticationSettings] ([AuthSettingId], [AuthCode], [AuthName], [IsEnabled], [OTPAttempt], [OTPResetTime], [OTPExpiryTime], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'EMAIL_VERIFY', N'Email Verification', 0, 3, 1, 15, 1, 1, NULL, CAST(N'2026-06-05T13:28:11.607' AS DateTime), N'U', NULL)
INSERT [dbo].[AuthenticationSettings] ([AuthSettingId], [AuthCode], [AuthName], [IsEnabled], [OTPAttempt], [OTPResetTime], [OTPExpiryTime], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'MOBILE_VERIFY', N'Mobile OTP Verification', 0, 3, 1, 20, 1, 1, NULL, CAST(N'2026-06-05T13:28:11.607' AS DateTime), N'U', NULL)
INSERT [dbo].[AuthenticationSettings] ([AuthSettingId], [AuthCode], [AuthName], [IsEnabled], [OTPAttempt], [OTPResetTime], [OTPExpiryTime], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (3, N'CAPTCHA', N'Captcha Validation', 1, NULL, NULL, NULL, 1, 1, NULL, CAST(N'2026-06-05T13:28:11.607' AS DateTime), N'U', NULL)
INSERT [dbo].[AuthenticationSettings] ([AuthSettingId], [AuthCode], [AuthName], [IsEnabled], [OTPAttempt], [OTPResetTime], [OTPExpiryTime], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (4, N'TWO_FACTOR', N'Two Factor Authentication', 0, 3, NULL, NULL, 1, 1, NULL, CAST(N'2026-06-05T13:28:11.607' AS DateTime), N'U', NULL)
SET IDENTITY_INSERT [dbo].[AuthenticationSettings] OFF
GO
SET IDENTITY_INSERT [dbo].[CategoryMaster] ON 

INSERT [dbo].[CategoryMaster] ([Id], [Name], [Code], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'ST', N'ST', 1, 0, CAST(N'2026-02-17T14:56:33.273' AS DateTime), CAST(N'2026-02-17T15:38:00.793' AS DateTime), N'R', CAST(N'2026-02-17T15:37:52.700' AS DateTime))
INSERT [dbo].[CategoryMaster] ([Id], [Name], [Code], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'SEBC', N'SEBC', 1, 0, CAST(N'2026-02-17T14:56:33.273' AS DateTime), CAST(N'2026-02-17T15:38:00.793' AS DateTime), NULL, CAST(N'2026-02-17T15:37:52.700' AS DateTime))
SET IDENTITY_INSERT [dbo].[CategoryMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[City] ON 

INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'Ahmedabad', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'Surat', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (3, N'Vadodara', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (4, N'Rajkot', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (5, N'Bhavnagar', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (6, N'Jamnagar', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (7, N'Junagadh', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (8, N'Gandhinagar', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (9, N'Anand', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (10, N'Nadiad', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (11, N'Mehsana', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (12, N'Patan', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (13, N'Surendranagar', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (14, N'Morbi', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (15, N'Porbandar', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (16, N'Bharuch', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (17, N'Navsari', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (18, N'Valsad', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (19, N'Vapi', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (20, N'Godhra', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (21, N'Dahod', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (22, N'Palanpur', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (23, N'Himmatnagar', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (24, N'Veraval', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (25, N'Botad', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (26, N'Amreli', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (27, N'Dwarka', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (28, N'Jetpur', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (29, N'Kalol', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (30, N'Deesa', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (31, N'Modasa', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (32, N'Khambhat', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (33, N'Mandvi', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (34, N'Bhuj', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (35, N'Anjar', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (36, N'Gondal', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (37, N'Unjha', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (38, N'Visnagar', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (39, N'Kadi', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (40, N'Sanand', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (41, N'Dholka', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (42, N'Lunawada', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (43, N'Vyara', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (44, N'Songadh', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (45, N'Umreth', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[City] ([CityId], [CityName], [StateId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (46, N'Halol', 7, 1, 1, CAST(N'2026-02-06T11:10:19.917' AS DateTime), NULL, N'I', NULL)
SET IDENTITY_INSERT [dbo].[City] OFF
GO
SET IDENTITY_INSERT [dbo].[Country] ON 

INSERT [dbo].[Country] ([Id], [CountryName], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'India', 1, 1, CAST(N'2026-02-06T11:09:52.413' AS DateTime), NULL, N'I', NULL)
SET IDENTITY_INSERT [dbo].[Country] OFF
GO
SET IDENTITY_INSERT [dbo].[EmailLoginOtp] ON 

INSERT [dbo].[EmailLoginOtp] ([Id], [EmpId], [Email], [OtpType], [OtpHash], [ExpiryTime], [IsUsed], [CreatedAt], [UsedAt]) VALUES (1, 2, N'19mca001@gardividyapith.ac.in', N'email_verify', N'AX3qg5unB9NxJ+l6ppgGixZ9vNFATESt3BFTvmYfDgg=', CAST(N'2026-01-16T11:54:25.937' AS DateTime), 1, CAST(N'2026-01-16T11:39:25.9438132' AS DateTime2), CAST(N'2026-01-16T11:39:37.9254632' AS DateTime2))
SET IDENTITY_INSERT [dbo].[EmailLoginOtp] OFF
GO
SET IDENTITY_INSERT [dbo].[EmailMaster] ON 

INSERT [dbo].[EmailMaster] ([emailId], [email], [appPassword], [smtpPort], [smtpServer], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'test@gmail.com', N'1234567890123454', 587, N'test.com', 1, 0, CAST(N'2026-01-13T13:24:20.883' AS DateTime), CAST(N'2026-01-29T13:47:44.140' AS DateTime), N'U', NULL)
SET IDENTITY_INSERT [dbo].[EmailMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[formMaster] ON 

INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, 1, N'Dashboard', N'Dashboard', N'fas fa-home', 0, N'Home', N'Dashboard', 1, N'parent-no-sub', 1, N'5', 1, 1, CAST(N'2026-01-19T16:03:51.097' AS DateTime), CAST(N'2026-02-10T11:12:00.773' AS DateTime), N'U', NULL)
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, 1, N'Master''s', N'Master', N'fas fa-layer-group', 0, N'', N'', 2, N'parent', 1, N'', 1, 1, CAST(N'2026-01-19T16:04:22.807' AS DateTime), CAST(N'2026-02-10T11:12:00.780' AS DateTime), N'U', NULL)
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (3, 1, N'Super Admin', N'SuperAdmin', N'fas fa-user-shield', 0, N'', N'', 3, N'parent', 1, N'', 1, 1, CAST(N'2026-01-19T16:04:43.157' AS DateTime), CAST(N'2026-02-10T11:12:00.797' AS DateTime), N'U', NULL)
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (4, 1, N'Role Master', N'RoleMaster', N'fas fa-user-shield', 2, N'roleMaster', N'role', 2, N'submenu', 0, N'1,3,4,2', 1, 1, CAST(N'2026-01-19T16:05:21.070' AS DateTime), CAST(N'2026-02-10T11:12:00.790' AS DateTime), N'U', CAST(N'2026-01-21T10:44:45.270' AS DateTime))
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (6, 1, N'Authentication setting', N'AuthenticationSetting', N'fas fa-user-lock', 2, N'AuthPasswordSetting', N'AuthenticationSetting', 3, N'submenu', 0, N'1,3,4,2', 1, 1, CAST(N'2026-01-20T14:56:44.490' AS DateTime), CAST(N'2026-02-10T11:12:00.807' AS DateTime), N'U', NULL)
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (7, 1, N'Form master', N'FormMaster', N'fas fa-cube', 1, N'FormMaster', N'FormMasterScreen', 3, N'submenu', 0, N'1,3,4,2', 1, 1, CAST(N'2026-01-21T10:40:43.583' AS DateTime), CAST(N'2026-02-10T11:12:00.803' AS DateTime), N'U', NULL)
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (22, 1, N'Academic Year', N'AcademicYear', N'fas fa-calendar-alt', 4, N'AcadamicYear', N'AcadamicView', 2, N'submenu', 0, N'1,2,6', 1, 1, CAST(N'2026-02-12T13:36:17.393' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (24, 2, N'TEST', N'T', N'fas fatrs', 0, N'', N'', 4, N'parent', 1, N'', 1, 1, CAST(N'2026-02-13T17:32:18.553' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (25, 2, N'TEST2', N'T2', N'test icon', 1, N'Home', N'Test', 4, N'submenu', 0, N'3', 1, 1, CAST(N'2026-02-13T17:32:50.100' AS DateTime), CAST(N'2026-02-13T17:38:34.713' AS DateTime), N'U', NULL)
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (26, 1, N'Category Master', N'CategoryMaster', N'fas fa-tags', 6, N'category', N'categoryView', 2, N'submenu', 0, N'1,3,2,5', 1, 1, CAST(N'2026-02-17T15:36:19.773' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (27, 1, N'Admission Configuration', N'AdmissionConfiguration', N'fas fa-chalkboard-teacher', 0, N'', N'', 5, N'parent', 1, N'', 1, 1, CAST(N'2026-03-17T11:58:19.203' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (28, 1, N'Registration Verification', N'RegistrationVerification', N'fas fa-user-check', 1, N'RegistrationVerification', N'RegistrationVerificationView', 5, N'submenu', 0, N'1,2,5', 0, 0, CAST(N'2026-03-17T11:59:35.857' AS DateTime), NULL, N'D', CAST(N'2026-06-05T13:35:13.547' AS DateTime))
INSERT [dbo].[formMaster] ([id], [moduleId], [formName], [formCode], [formIcon], [menuOrder], [controller_name], [actionName], [parentId], [menuType], [isMenu], [ActionList], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (30, 1, N'Progress Tracking', N'ProgressTracking', N'fas fa-chart-pie', 7, N'ProgressTracking', N'ProgressTrackingView', 5, N'submenu', 0, N'5', 0, 1, CAST(N'2026-03-18T17:02:17.517' AS DateTime), CAST(N'2026-03-18T17:06:04.977' AS DateTime), N'U', NULL)
SET IDENTITY_INSERT [dbo].[formMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[ModuleDetails] ON 

INSERT [dbo].[ModuleDetails] ([id], [Name], [Description], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'Admission', NULL, 1, 1, NULL, NULL, N'I', NULL)
INSERT [dbo].[ModuleDetails] ([id], [Name], [Description], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'Convocation', NULL, 1, 1, NULL, NULL, N'I', NULL)
INSERT [dbo].[ModuleDetails] ([id], [Name], [Description], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (3, N'EXMAS', NULL, 1, 1, NULL, NULL, N'I', NULL)
SET IDENTITY_INSERT [dbo].[ModuleDetails] OFF
GO
SET IDENTITY_INSERT [dbo].[NotificationTemplate] ON 

INSERT [dbo].[NotificationTemplate] ([Id], [EventCode], [EventName], [Channel], [Subject], [Body], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'PAY_SUCCESS', N'Payment successfull', N'SMS', N'', N'<p>Dear {UserName}, your OTP for registration is {OTP}. It is valid for {ExpiryMinutes} minutes. Do not share it with anyone.<br>&nbsp;</p>', 1, 0, CAST(N'2026-04-02T15:01:35.263' AS DateTime), CAST(N'2026-04-02T16:53:19.710' AS DateTime), N'U', NULL)
INSERT [dbo].[NotificationTemplate] ([Id], [EventCode], [EventName], [Channel], [Subject], [Body], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'PAY_SUCCESS', N'Payment successful What''s App', N'WHATSAPP', N'', N'<p>👋 Hello {UserName},</p><p>Your registration OTP is *{OTP}* 🔐 &nbsp;<br>This OTP is valid for {ExpiryMinutes} minutes.</p><p>Please do not share it with anyone.</p><p>Thanks, &nbsp;<br>{AppName}<br>&nbsp;</p>', 1, 0, CAST(N'2026-04-02T15:37:04.140' AS DateTime), CAST(N'2026-04-02T15:37:04.177' AS DateTime), N'U', NULL)
INSERT [dbo].[NotificationTemplate] ([Id], [EventCode], [EventName], [Channel], [Subject], [Body], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (3, N'PAY_SUCCESS', N'Payment successfull Email', N'EMAIL', N'Registration OTP - {AppName}', N'<p>Dear {UserName},</p><p>Thank you for registering with {AppName}.</p><p>Your One-Time Password (OTP) is: {OTP}</p><p>This OTP is valid for {ExpiryMinutes} minutes.</p><p>If you did not request this, please ignore this email.</p><p>Regards, &nbsp;<br>{AppName} Team<br>&nbsp;</p>', 1, 0, CAST(N'2026-04-02T15:37:42.847' AS DateTime), CAST(N'2026-04-02T15:37:42.847' AS DateTime), N'U', NULL)
SET IDENTITY_INSERT [dbo].[NotificationTemplate] OFF
GO
SET IDENTITY_INSERT [dbo].[PasswordRules] ON 

INSERT [dbo].[PasswordRules] ([RuleId], [RuleCode], [RuleName], [IsEnabled], [RuleValue], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'MIN_LENGTH', N'Minimum Password Length', 1, 8, 1, 0, NULL, CAST(N'2026-01-29T13:47:33.733' AS DateTime), N'U', NULL)
INSERT [dbo].[PasswordRules] ([RuleId], [RuleCode], [RuleName], [IsEnabled], [RuleValue], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'UPPERCASE', N'At least one uppercase letter', 1, 1, 1, 0, NULL, CAST(N'2026-01-29T13:47:33.733' AS DateTime), N'U', NULL)
INSERT [dbo].[PasswordRules] ([RuleId], [RuleCode], [RuleName], [IsEnabled], [RuleValue], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (3, N'LOWERCASE', N'At least one lowercase letter', 1, 1, 1, 0, NULL, CAST(N'2026-01-29T13:47:33.733' AS DateTime), N'U', NULL)
INSERT [dbo].[PasswordRules] ([RuleId], [RuleCode], [RuleName], [IsEnabled], [RuleValue], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (4, N'NUMBER', N'At least one numeric character', 1, 1, 1, 0, NULL, CAST(N'2026-01-29T13:47:33.733' AS DateTime), N'U', NULL)
INSERT [dbo].[PasswordRules] ([RuleId], [RuleCode], [RuleName], [IsEnabled], [RuleValue], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (5, N'SPECIAL_CHAR', N'At least one special character', 1, 1, 1, 0, NULL, CAST(N'2026-01-29T13:47:33.733' AS DateTime), N'U', NULL)
SET IDENTITY_INSERT [dbo].[PasswordRules] OFF
GO
SET IDENTITY_INSERT [dbo].[PaymentSetting] ON 

INSERT [dbo].[PaymentSetting] ([id], [paymentTiming], [applicationFee], [retryAttempts], [refundableFee], [testMode], [gatewayProvider], [merchantKey], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'after_kyc', CAST(143.00 AS Decimal(10, 2)), 5, 1, 1, N'Phone Pay', N'fsfo90543jifjosd903', 1, 0, CAST(N'2026-04-01T16:43:31.150' AS DateTime), CAST(N'2026-04-01T16:57:58.063' AS DateTime), N'U', NULL)
SET IDENTITY_INSERT [dbo].[PaymentSetting] OFF
GO
SET IDENTITY_INSERT [dbo].[ProgramMaster] ON 

INSERT [dbo].[ProgramMaster] ([Id], [degreeId], [Name], [Code], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (7, 1, N'Bachelor Computer Application', N'BCA-3', 1, 0, CAST(N'2026-02-13T12:33:55.553' AS DateTime), CAST(N'2026-03-25T17:02:59.883' AS DateTime), N'U', NULL)
INSERT [dbo].[ProgramMaster] ([Id], [degreeId], [Name], [Code], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (8, 1, N'Bachelor in technology', N'B.tech', 1, 1, CAST(N'2026-02-17T10:32:58.680' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[ProgramMaster] ([Id], [degreeId], [Name], [Code], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (9, 1, N'Test3', N'T4', 1, 1, CAST(N'2026-03-25T17:02:17.243' AS DateTime), CAST(N'2026-03-25T17:03:05.897' AS DateTime), N'U', NULL)
SET IDENTITY_INSERT [dbo].[ProgramMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[QuotaMaster] ON 

INSERT [dbo].[QuotaMaster] ([Id], [Name], [Code], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'Goverment Finance', N'GF', 1, 1, CAST(N'2026-02-23T00:00:00.000' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[QuotaMaster] ([Id], [Name], [Code], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'SELF Finance', N'SF', 1, 1, CAST(N'2026-02-23T00:00:00.000' AS DateTime), NULL, N'I', NULL)
SET IDENTITY_INSERT [dbo].[QuotaMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[Registration] ON 

INSERT [dbo].[Registration] ([EmpId], [Emp_name], [Address], [City_id], [City], [State], [Pincode], [Email], [Password], [Mobile], [Birthdate], [IP_address], [Insert_date], [Update_date], [Delete_date], [Is_delete], [IsActive], [IsActive_Remark], [U_id], [Role_id], [Fc_id], [College_id], [Desig_id], [Emp_code], [Note], [FormName], [Primary_Emp_Id], [EmpStatus], [merge_status], [Disci_id]) VALUES (1, N'TEST SUPPORT', N'RAJKOT', 1, N'ANAND', N'GUJARAT', N'360002', N'kapil@mandaviya.com', N'QBCcbMcaIg3Gk89sAeOSvw==', N'7600017671', N'01/01/2000', N'182.237.14.194', N'18/06/2018', N'20/11/2025', NULL, N'N', 1, NULL, 1, 1, 1, 1, 4, N'PS1', N'', N'Login', 1, N'P', NULL, NULL)
INSERT [dbo].[Registration] ([EmpId], [Emp_name], [Address], [City_id], [City], [State], [Pincode], [Email], [Password], [Mobile], [Birthdate], [IP_address], [Insert_date], [Update_date], [Delete_date], [Is_delete], [IsActive], [IsActive_Remark], [U_id], [Role_id], [Fc_id], [College_id], [Desig_id], [Emp_code], [Note], [FormName], [Primary_Emp_Id], [EmpStatus], [merge_status], [Disci_id]) VALUES (2, N'Kapil Mandaviya', N'RAJKOT', 1, N'Jamnagar', N'GUJARAT', N'361120', N'19mca001@gardividyapith.ac.in', N'QBCcbMcaIg3Gk89sAeOSvw==', N'9601500889', N'01/01/2000', N'182.237.14.194', N'18/06/2018', N'20/11/2025', NULL, N'N', 1, NULL, 1, 2, NULL, 1, 4, N'PS1', N'', N'Login', 2, N'P', NULL, NULL)
SET IDENTITY_INSERT [dbo].[Registration] OFF
GO
SET IDENTITY_INSERT [dbo].[RegistrationVerificationSettings] ON 

INSERT [dbo].[RegistrationVerificationSettings] ([id], [mobileOtpRequired], [emailOtpRequired], [autoExpireEnabled], [mobileOtpAttempts], [mobileOtpReset], [mobileOtpExpiration], [emailOtpAttempts], [emailOtpReset], [emailOtpExpiration], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, 0, 0, 1, 12, 5, 5, 5, 5, 65, 1, 1, CAST(N'2026-03-17T11:51:14.833' AS DateTime), CAST(N'2026-03-25T17:12:55.277' AS DateTime), N'U', NULL)
SET IDENTITY_INSERT [dbo].[RegistrationVerificationSettings] OFF
GO
SET IDENTITY_INSERT [dbo].[RoleFormsPermissions] ON 

INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, 1, 1, 1, 5, N'Admission_Dashboard_VIEW', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, 1, 1, 4, 1, N'Admission_RoleMaster_CREATE', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-02-10T15:42:29.753' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (3, 1, 1, 4, 2, N'Admission_RoleMaster_UPDATE', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-02-10T15:42:29.753' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (4, 1, 1, 4, 3, N'Admission_RoleMaster_DELETE', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-02-10T15:42:29.753' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (5, 1, 1, 4, 4, N'Admission_RoleMaster_PRINT', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-02-10T15:42:29.753' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (10, 1, 1, 6, 1, N'Admission_AuthenticationSetting_CREATE', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (11, 1, 1, 6, 2, N'Admission_AuthenticationSetting_UPDATE', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-02-19T17:32:20.013' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (12, 1, 1, 6, 3, N'Admission_AuthenticationSetting_DELETE', 0, 0, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-02-10T15:52:45.450' AS DateTime), N'D', CAST(N'2026-06-05T13:35:02.017' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (13, 1, 1, 6, 4, N'Admission_AuthenticationSetting_PRINT', 0, 0, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-02-10T15:52:45.450' AS DateTime), N'D', CAST(N'2026-06-05T13:35:02.017' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (14, 1, 1, 7, 1, N'Admission_FormMaster_CREATE', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (15, 1, 1, 7, 2, N'Admission_FormMaster_UPDATE', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-03-23T14:59:44.990' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (16, 1, 1, 7, 3, N'Admission_FormMaster_DELETE', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-03-23T14:59:44.990' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (17, 1, 1, 7, 4, N'Admission_FormMaster_PRINT', 1, 1, 1, CAST(N'2026-02-10T10:51:48.760' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-02-10T16:01:41.603' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (18, 2, 1, 1, 5, N'Admission_Dashboard_VIEW', 1, 1, 1, CAST(N'2026-02-10T10:52:12.407' AS DateTime), CAST(N'2026-02-10T11:31:49.447' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (19, 2, 1, 4, 1, N'Admission_RoleMaster_CREATE', 1, 1, 1, CAST(N'2026-02-10T10:52:12.407' AS DateTime), CAST(N'2026-02-10T11:31:49.447' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (20, 2, 1, 4, 2, N'Admission_RoleMaster_UPDATE', 1, 1, 1, CAST(N'2026-02-10T10:52:12.407' AS DateTime), CAST(N'2026-02-10T11:31:49.447' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (21, 2, 1, 4, 3, N'Admission_RoleMaster_DELETE', 1, 1, 1, CAST(N'2026-02-10T10:52:12.407' AS DateTime), CAST(N'2026-02-10T11:31:49.447' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (22, 2, 1, 4, 4, N'Admission_RoleMaster_INSERT', 1, 1, 1, CAST(N'2026-02-10T10:52:12.407' AS DateTime), CAST(N'2026-02-10T11:31:49.447' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (35, 1, 1, 22, 1, N'Admission_AcademicYear_CREATE', 1, 1, 1, CAST(N'2026-02-12T13:36:36.583' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-02-13T12:39:01.490' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (36, 1, 1, 22, 2, N'Admission_AcademicYear_UPDATE', 1, 1, 1, CAST(N'2026-02-12T13:36:36.583' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-02-13T12:39:01.490' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (37, 1, 1, 22, 6, N'Admission_AcademicYear_MAKEACTIVE', 1, 1, 1, CAST(N'2026-02-12T13:36:36.583' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', CAST(N'2026-02-12T16:15:26.970' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (42, 1, 1, 26, 1, N'Admission_CategoryMaster_CREATE', 1, 1, 1, CAST(N'2026-02-17T15:37:05.153' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (43, 1, 1, 26, 2, N'Admission_CategoryMaster_UPDATE', 1, 1, 1, CAST(N'2026-02-17T15:37:05.153' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (44, 1, 1, 26, 3, N'Admission_CategoryMaster_DELETE', 1, 1, 1, CAST(N'2026-02-17T15:37:05.153' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (45, 1, 1, 26, 5, N'Admission_CategoryMaster_VIEW', 1, 1, 1, CAST(N'2026-02-17T15:37:05.153' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (46, 1, 1, 28, 1, N'Admission_RegistrationVerification_CREATE', 0, 0, 1, CAST(N'2026-03-17T12:00:30.217' AS DateTime), CAST(N'2026-03-30T16:14:45.193' AS DateTime), N'D', CAST(N'2026-06-05T13:35:02.017' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (47, 1, 1, 28, 2, N'Admission_RegistrationVerification_UPDATE', 0, 0, 1, CAST(N'2026-03-17T12:00:30.217' AS DateTime), CAST(N'2026-03-30T16:14:45.193' AS DateTime), N'D', CAST(N'2026-06-05T13:35:02.017' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (48, 1, 1, 28, 5, N'Admission_RegistrationVerification_VIEW', 0, 0, 1, CAST(N'2026-03-17T12:00:30.217' AS DateTime), CAST(N'2026-03-30T16:14:45.193' AS DateTime), N'D', CAST(N'2026-06-05T13:35:02.017' AS DateTime))
INSERT [dbo].[RoleFormsPermissions] ([id], [roleId], [moduleId], [formId], [ActionId], [permissionKey], [can_View], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (53, 1, 1, 30, 5, N'Admission_ProgressTracking_VIEW', 0, 0, 1, CAST(N'2026-03-18T17:02:32.410' AS DateTime), CAST(N'2026-03-18T17:06:33.330' AS DateTime), N'D', CAST(N'2026-06-05T13:35:02.017' AS DateTime))
SET IDENTITY_INSERT [dbo].[RoleFormsPermissions] OFF
GO
SET IDENTITY_INSERT [dbo].[RoleMaster] ON 

INSERT [dbo].[RoleMaster] ([id], [roleName], [priorityOrder], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'SuperAdmin', 1, 1, 1, CAST(N'2026-01-19T16:06:14.043' AS DateTime), CAST(N'2026-06-05T13:35:01.993' AS DateTime), N'U', NULL)
INSERT [dbo].[RoleMaster] ([id], [roleName], [priorityOrder], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'Admin', 2, 1, 1, CAST(N'2026-01-20T11:19:45.527' AS DateTime), CAST(N'2026-02-10T11:31:49.447' AS DateTime), N'U', NULL)
SET IDENTITY_INSERT [dbo].[RoleMaster] OFF
GO
SET IDENTITY_INSERT [dbo].[State] ON 

INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (1, N'Andhra Pradesh', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (2, N'Arunachal Pradesh', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (3, N'Assam', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (4, N'Bihar', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (5, N'Chhattisgarh', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (6, N'Goa', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (7, N'Gujarat', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (8, N'Haryana', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (9, N'Himachal Pradesh', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (10, N'Jharkhand', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (11, N'Karnataka', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (12, N'Kerala', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (13, N'Madhya Pradesh', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (14, N'Maharashtra', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (15, N'Manipur', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (16, N'Meghalaya', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (17, N'Mizoram', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (18, N'Nagaland', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (19, N'Odisha', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (20, N'Punjab', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (21, N'Rajasthan', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (22, N'Sikkim', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (23, N'Tamil Nadu', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (24, N'Telangana', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (25, N'Tripura', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (26, N'Uttar Pradesh', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (27, N'Uttarakhand', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (28, N'West Bengal', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
INSERT [dbo].[State] ([Id], [StateName], [CountryId], [isActive], [createdBy], [createdDate], [updateDate], [lastModify], [deletedDate]) VALUES (29, N'Delhi', 1, 1, 1, CAST(N'2026-02-06T11:10:02.983' AS DateTime), NULL, N'I', NULL)
SET IDENTITY_INSERT [dbo].[State] OFF
GO
SET IDENTITY_INSERT [dbo].[UserTwoFactor] ON 

INSERT [dbo].[UserTwoFactor] ([Id], [EmpId], [SecretKey], [IsEnabled], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (5, 2, N'AWMK6KY6YCOJM3Y5TVKFN5OG7WKPHBII', 1, 1, CAST(N'2025-12-24T16:11:34.120' AS DateTime), CAST(N'2026-01-16T11:39:59.910' AS DateTime))
INSERT [dbo].[UserTwoFactor] ([Id], [EmpId], [SecretKey], [IsEnabled], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (6, 1, NULL, 0, 1, CAST(N'2025-12-26T16:13:11.113' AS DateTime), CAST(N'2025-12-26T16:13:11.300' AS DateTime))
SET IDENTITY_INSERT [dbo].[UserTwoFactor] OFF
GO
/****** Object:  Index [IX_AcademicYear_Active]    Script Date: 05-06-2026 14:19:47 ******/
CREATE NONCLUSTERED INDEX [IX_AcademicYear_Active] ON [dbo].[Academic_year]
(
	[Id] ASC,
	[isActive] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Authenti__3C31BBCF854CC5E7]    Script Date: 05-06-2026 14:19:47 ******/
ALTER TABLE [dbo].[AuthenticationSettings] ADD  CONSTRAINT [UQ__Authenti__3C31BBCF854CC5E7] UNIQUE NONCLUSTERED 
(
	[AuthCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_CategoryMaster_Id_Code]    Script Date: 05-06-2026 14:19:47 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_CategoryMaster_Id_Code] ON [dbo].[CategoryMaster]
(
	[Id] ASC,
	[Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_CategoryMaster_Id_Code_Active]    Script Date: 05-06-2026 14:19:47 ******/
CREATE NONCLUSTERED INDEX [IX_CategoryMaster_Id_Code_Active] ON [dbo].[CategoryMaster]
(
	[Id] ASC,
	[Code] ASC,
	[isActive] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__moduleMa__B16D3ED5AC3CB3EA]    Script Date: 05-06-2026 14:19:47 ******/
ALTER TABLE [dbo].[formMaster] ADD  CONSTRAINT [UQ__moduleMa__B16D3ED5AC3CB3EA] UNIQUE NONCLUSTERED 
(
	[formCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_Event_Channel]    Script Date: 05-06-2026 14:19:47 ******/
ALTER TABLE [dbo].[NotificationTemplate] ADD  CONSTRAINT [UQ_Event_Channel] UNIQUE NONCLUSTERED 
(
	[EventCode] ASC,
	[Channel] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_ProgramMaster_Active]    Script Date: 05-06-2026 14:19:47 ******/
CREATE NONCLUSTERED INDEX [IX_ProgramMaster_Active] ON [dbo].[ProgramMaster]
(
	[Id] ASC,
	[isActive] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_QuotaMaster_Active]    Script Date: 05-06-2026 14:19:47 ******/
CREATE NONCLUSTERED INDEX [IX_QuotaMaster_Active] ON [dbo].[QuotaMaster]
(
	[Id] ASC,
	[isActive] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [idx_Registration]    Script Date: 05-06-2026 14:19:47 ******/
CREATE NONCLUSTERED INDEX [idx_Registration] ON [dbo].[Registration]
(
	[EmpId] ASC,
	[Emp_name] ASC,
	[City_id] ASC,
	[City] ASC,
	[Is_delete] ASC,
	[IsActive] ASC,
	[Role_id] ASC,
	[Fc_id] ASC,
	[Desig_id] ASC,
	[Emp_code] ASC,
	[EmpStatus] ASC,
	[merge_status] ASC,
	[College_id] ASC,
	[Primary_Emp_Id] ASC
)
INCLUDE([Address],[State],[Pincode],[Email],[Password],[Mobile],[Birthdate],[IP_address],[Insert_date],[Update_date],[Delete_date],[IsActive_Remark],[U_id],[Note],[FormName],[Disci_id]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AuthenticationSettings] ADD  CONSTRAINT [DF__Authentic__IsEna__4AB81AF0]  DEFAULT ((1)) FOR [IsEnabled]
GO
ALTER TABLE [dbo].[City] ADD  CONSTRAINT [DF_City_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Country] ADD  CONSTRAINT [DF_Country_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[EmailLoginOtp] ADD  CONSTRAINT [DF__UserLogin__IsUse__123EB7A3]  DEFAULT ((0)) FOR [IsUsed]
GO
ALTER TABLE [dbo].[EmailLoginOtp] ADD  CONSTRAINT [DF__UserLogin__Creat__1332DBDC]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[formMaster] ADD  CONSTRAINT [DF__moduleMas__menu___395884C4]  DEFAULT ((0)) FOR [menuOrder]
GO
ALTER TABLE [dbo].[formMaster] ADD  CONSTRAINT [DF__moduleMas__is_me__3A4CA8FD]  DEFAULT ((1)) FOR [isMenu]
GO
ALTER TABLE [dbo].[formMaster] ADD  CONSTRAINT [DF__moduleMas__isAct__3B40CD36]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[MobileLoginOtp] ADD  CONSTRAINT [DF__MobileLog__IsUse__160F4887]  DEFAULT ((0)) FOR [IsUsed]
GO
ALTER TABLE [dbo].[MobileLoginOtp] ADD  CONSTRAINT [DF__MobileLog__Creat__17036CC0]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[PaymentSetting] ADD  CONSTRAINT [DF__PaymentSe__payme__4CC05EF3]  DEFAULT ('after_kyc') FOR [paymentTiming]
GO
ALTER TABLE [dbo].[PaymentSetting] ADD  CONSTRAINT [DF__PaymentSe__retry__4DB4832C]  DEFAULT ((3)) FOR [retryAttempts]
GO
ALTER TABLE [dbo].[PaymentSetting] ADD  CONSTRAINT [DF__PaymentSe__refun__4EA8A765]  DEFAULT ((0)) FOR [refundableFee]
GO
ALTER TABLE [dbo].[PaymentSetting] ADD  CONSTRAINT [DF__PaymentSe__testM__4F9CCB9E]  DEFAULT ((0)) FOR [testMode]
GO
ALTER TABLE [dbo].[RegistrationVerificationSettings] ADD  CONSTRAINT [DF__Registrat__mobil__5A4F643B]  DEFAULT ((0)) FOR [mobileOtpRequired]
GO
ALTER TABLE [dbo].[RegistrationVerificationSettings] ADD  CONSTRAINT [DF__Registrat__email__5B438874]  DEFAULT ((0)) FOR [emailOtpRequired]
GO
ALTER TABLE [dbo].[RegistrationVerificationSettings] ADD  CONSTRAINT [DF__Registrat__autoE__5C37ACAD]  DEFAULT ((0)) FOR [autoExpireEnabled]
GO
ALTER TABLE [dbo].[RoleFormsPermissions] ADD  CONSTRAINT [DF__role_modu__isAct__3F115E1A]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[State] ADD  CONSTRAINT [DF_State_isActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[UserTwoFactor] ADD  CONSTRAINT [DF__UserTwoFa__IsEna__5CD6CB2B]  DEFAULT ((0)) FOR [IsEnabled]
GO
ALTER TABLE [dbo].[UserTwoFactor] ADD  CONSTRAINT [DF__UserTwoFa__Creat__5DCAEF64]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[UserTwoFactor] ADD  CONSTRAINT [DF__UserTwoFa__Updat__5EBF139D]  DEFAULT (getdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[City]  WITH CHECK ADD FOREIGN KEY([StateId])
REFERENCES [dbo].[State] ([Id])
GO
ALTER TABLE [dbo].[State]  WITH CHECK ADD FOREIGN KEY([CountryId])
REFERENCES [dbo].[Country] ([Id])
GO
ALTER TABLE [dbo].[NotificationTemplate]  WITH CHECK ADD  CONSTRAINT [CHK_Channel_Valid] CHECK  (([Channel]='WHATSAPP' OR [Channel]='EMAIL' OR [Channel]='SMS'))
GO
ALTER TABLE [dbo].[NotificationTemplate] CHECK CONSTRAINT [CHK_Channel_Valid]
GO
ALTER TABLE [dbo].[PaymentSetting]  WITH CHECK ADD  CONSTRAINT [CK__PaymentSe__payme__4BCC3ABA] CHECK  (([paymentTiming]='before_kyc' OR [paymentTiming]='after_kyc'))
GO
ALTER TABLE [dbo].[PaymentSetting] CHECK CONSTRAINT [CK__PaymentSe__payme__4BCC3ABA]
GO
/****** Object:  StoredProcedure [dbo].[SaveOrUpdateRoleWithPermissions]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[SaveOrUpdateRoleWithPermissions]
(
    @RoleId        INT OUTPUT,
    @RoleName      NVARCHAR(100) NULL,
    @PriorityOrder INT NULL,
    @IsActive      BIT NULL,
    @createdBy     INT NULL,
	@ModuleId	   INT NULL,
    @Permissions   dbo.Type_RolePermissionList READONLY
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;
		-- After RoleMaster UPDATE
	--DECLARE @Updated INT = @@ROWCOUNT;
	--declare @ModuleId INT=null


        -----------------------------
        -- 1️⃣ RoleMaster Insert/Update
        -----------------------------
        IF (@RoleId = 0)
        BEGIN
            INSERT INTO RoleMaster
                (RoleName, PriorityOrder, IsActive, CreatedBy, CreatedDate, LastModify)
            VALUES
                (@RoleName, @PriorityOrder, 1, @createdBy, GETDATE(), 'I');

            SET @RoleId = SCOPE_IDENTITY();
        END
        ELSE
        BEGIN
            UPDATE RoleMaster
            SET RoleName      = @RoleName,
                PriorityOrder = @PriorityOrder,
                IsActive      = @IsActive,
                UpdateDate    = GETDATE(),
                LastModify    = 'U',
                CreatedBy     = @createdBy
            WHERE Id = @RoleId;
        END

        -----------------------------
        -- 2️⃣ RoleFormsPermissions UPSERT
        -----------------------------
        IF EXISTS (SELECT 1 FROM @Permissions)
        BEGIN
            -- Update existing permissions
            UPDATE rp
            SET rp.PermissionKey = p.PermissionKey,
                rp.IsActive      = p.IsActive,
				rp.can_view =p.canview,
                rp.UpdateDate    = GETDATE(),
                rp.LastModify    = 'U'
            FROM RoleFormsPermissions rp
            INNER JOIN @Permissions p
                ON rp.RoleId   = @RoleId
                --AND rp.ModuleId = p.ModuleId
				AND rp.ModuleId = @ModuleId
                AND rp.FormId   = p.FormId
                AND rp.ActionId = p.ActionId;

            -- Insert new permissions that do not exist
            INSERT INTO RoleFormsPermissions
                (RoleId, ModuleId, FormId, ActionId, PermissionKey, can_view,IsActive, CreatedBy, CreatedDate, LastModify)
            SELECT 
                @RoleId, @ModuleId, p.FormId, p.ActionId, p.PermissionKey, p.canview , p.IsActive, p.CreatedBy, GETDATE(), 'I'
            FROM @Permissions p
            WHERE NOT EXISTS (
                SELECT 1
                FROM RoleFormsPermissions rp
                WHERE rp.RoleId   = @RoleId
                  --AND rp.ModuleId = p.ModuleId
				  AND rp.ModuleId = @ModuleId
                  AND rp.FormId   = p.FormId
                  AND rp.ActionId = p.ActionId
            );

            -- Soft delete permissions that are NOT in the TVP
            UPDATE rp
            SET rp.IsActive    = 0,
                rp.DeletedDate = GETDATE(),
				rp.can_View=0,
                rp.LastModify  = 'D'
            FROM RoleFormsPermissions rp
            WHERE rp.RoleId = @RoleId AND rp.moduleId =@ModuleId
              AND NOT EXISTS (
                  SELECT 1
                  FROM @Permissions p
                  WHERE @ModuleId= rp.moduleId
                    AND p.FormId   = rp.FormId
                    AND p.ActionId = rp.ActionId
              );
        END
        ELSE
        BEGIN
            -- If TVP is empty, soft delete all permissions for this role
            UPDATE rp
            SET rp.IsActive    = 0,
				rp.can_View=0,
                rp.DeletedDate = GETDATE(),
                rp.LastModify  = 'D'
            FROM RoleFormsPermissions rp
            WHERE rp.RoleId = @RoleId AND moduleId = @ModuleId;
        END

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        RAISERROR (@ErrorMessage, @ErrorSeverity, 1);
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_getAllMenuSubMenuList]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[SP_getAllMenuSubMenuList]
@roleId int
AS
BEGIN


;WITH AllowedForms AS
(
    -- 1️⃣ All forms user can view
    SELECT distinct
		rfp.roleId,
		rfp.formId,
        fm.Id,
        fm.ParentId,
        fm.MenuType,
        fm.FormName,
        fm.FormCode,
        fm.FormIcon,
        fm.MenuOrder,
        fm.Controller_Name,
        fm.ActionName
      
    FROM FormMaster fm
    INNER JOIN RoleFormsPermissions rfp
        ON rfp.FormId = fm.Id
    WHERE
        rfp.RoleId = @roleId
        AND rfp.isActive= 1
		AND rfp.can_View=1
        AND fm.IsActive = 1
		AND fm.moduleId=1
        
),
ParentMenus AS
(
    -- 2️⃣ Only parents actually used by allowed submenus
    SELECT DISTINCT
        fm.*
    FROM FormMaster fm
    INNER JOIN AllowedForms af
        ON af.ParentId = fm.parentId
    WHERE
        af.MenuType = 'submenu'
        AND fm.MenuType = 'parent'
        AND fm.IsActive = 1
        
)

-- 3️⃣ Final result
SELECT
    af.Id              AS MenuId,
    af.FormName,
    af.FormCode,
    af.FormIcon,
    af.MenuOrder,
    af.Controller_Name,
    af.ActionName,
    af.ParentId,
    af.MenuType,
    ISNULL(af.ParentId, af.Id) AS SortParentId
FROM AllowedForms af

UNION ALL

SELECT
    pm.Id              AS MenuId,
    pm.FormName,
    pm.FormCode,
    pm.FormIcon,
    pm.MenuOrder,
    pm.Controller_Name,
    pm.ActionName,
    pm.ParentId,
    pm.MenuType,
    pm.Id AS SortParentId
FROM ParentMenus pm

ORDER BY
    SortParentId,
    MenuOrder; 

END
GO
/****** Object:  StoredProcedure [dbo].[SP_getPermissionByUserRole]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_getPermissionByUserRole]
(
    @EmpId  INT,
    @RoleId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT distinct
        f.formCode,
        a.Name as actionName,              -- optional (VIEW, CREATE, UPDATE, etc.)
        p.permissionKey
    FROM RoleFormsPermissions p
    INNER JOIN Registration r
        ON r.Role_id = p.roleId
    INNER JOIN FormMaster f
        ON f.id = p.formId

    INNER JOIN ActionMaster a
        ON a.id = p.ActionId
    WHERE
        p.roleId   = @RoleId
        AND r.EmpId = @EmpId
        AND p.can_view = 1
        AND p.isActive = 1
        AND r.isActive = 1
        AND f.isActive = 1

		  UNION

    -- Extra View permissions for forms where can_view = 1
    SELECT distinct 
        f.formCode,
        'VIEW' as ActionName,
        m.Name+'_'+f.formCode +'_'+ 'VIEW' as PermissionKey
    FROM RoleFormsPermissions p
    INNER JOIN Registration r
        ON r.Role_id = p.roleId
    INNER JOIN FormMaster f
        ON f.id = p.formId
	Inner JOIN ModuleDetails M ON f.moduleId=m.id
    WHERE
        p.roleId   = @RoleId
        AND r.EmpId = @EmpId
        AND p.can_view = 1
        AND p.isActive = 1
        AND r.isActive = 1
        AND f.isActive = 1
		AND m.isactive=1;
END
GO
/****** Object:  Trigger [dbo].[trg_FormMaster_RoleFormPermission_ActionSync]    Script Date: 05-06-2026 14:19:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TRIGGER [dbo].[trg_FormMaster_RoleFormPermission_ActionSync]
ON [dbo].[formMaster]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Only proceed if ActionList changed
    IF NOT UPDATE(ActionList)
        RETURN;

    DECLARE @FormId INT, @ModuleId INT,@createdBy INT;

    -- Assuming single row update
    SELECT
        @FormId   = i.id,
        @ModuleId = i.moduleId,
		@createdBy =i.createdBy
    FROM inserted i;

    /* ==========================================
       Split ActionList and find differences
       ========================================== */

    -- Newly added actions (inserted - deleted)
    ;WITH NewActions AS (
        SELECT DISTINCT CAST(LTRIM(RTRIM(i.value)) AS INT) AS ActionId
        FROM inserted ins
        CROSS APPLY STRING_SPLIT(ins.ActionList, ',') i
        EXCEPT
        SELECT DISTINCT CAST(LTRIM(RTRIM(d.value)) AS INT) AS ActionId
        FROM deleted del
        CROSS APPLY STRING_SPLIT(del.ActionList, ',') d
    ),

   
    -- Distinct roles that already have this form in the module
    RolesForForm AS (
        SELECT DISTINCT roleId
        FROM RoleFormsPermissions
        WHERE formId   = @FormId 
          AND moduleId = @ModuleId
		      AND isActive = 1      -- only a
			      AND can_View = 1      -- only a
    )

	-- 1️⃣ REACTIVATE existing inactive actions
			UPDATE rp
			SET 
				rp.isActive  = 1,
				rp.can_View  = 1,
				rp.deletedDate = NULL,  -- reset deleted date if needed
				rp.updateDate  = GETDATE(),
				rp.lastModify='U',
				rp.createdBy=@createdBy
			FROM RoleFormsPermissions rp
			JOIN RolesForForm r ON rp.roleId = r.roleId
			JOIN NewActions na ON rp.ActionId = na.ActionId
			WHERE rp.formId   = @FormId
			  AND rp.moduleId = @ModuleId
			  AND rp.isActive = 0;

			-- 2️⃣ INSERT only truly new actions (doesn't exist at all)

			 ;WITH NewActionsInsert AS (
        SELECT DISTINCT CAST(LTRIM(RTRIM(i.value)) AS INT) AS ActionId
        FROM inserted ins
        CROSS APPLY STRING_SPLIT(ins.ActionList, ',') i
        EXCEPT
        SELECT DISTINCT CAST(LTRIM(RTRIM(d.value)) AS INT) AS ActionId
        FROM deleted del
        CROSS APPLY STRING_SPLIT(del.ActionList, ',') d
    ),

   
    -- Distinct roles that already have this form in the module
    RolesForFormInsert AS (
        SELECT DISTINCT roleId
        FROM RoleFormsPermissions
        WHERE formId   = @FormId
          AND moduleId = @ModuleId
		     AND isActive = 1      -- only a
			      AND can_View = 1      -- only a
    )

			INSERT INTO RoleFormsPermissions
			(
				roleId,
				moduleId,
				formId,
				ActionId,
				permissionKey,
				can_View,
				isActive,
				createdDate,
				lastModify,
				createdBy
			)
			SELECT
				r.roleId,
				@ModuleId,
				@FormId,
				na.ActionId,
				md.Name + '_' + fm.formCode + '_' + am.Name,
				1, -- default can_View
				1, -- isActive
				GETDATE(),
				'I',
				@createdBy
			FROM RolesForFormInsert r
			CROSS JOIN NewActionsInsert na
			JOIN FormMaster fm    ON fm.id = @FormId
			JOIN ActionMaster am  ON am.id = na.ActionId
			JOIN ModuleDetails md ON md.id = fm.moduleId
			WHERE NOT EXISTS (
				SELECT 1
				FROM RoleFormsPermissions x
				WHERE x.roleId   = r.roleId
				  AND x.formId   = @FormId
				  AND x.ActionId = na.ActionId
			);
			 
    /* ==========================================
       DEACTIVATE removed actions
       ========================================== */
	 -- Removed actions (deleted - inserted)
    ;WITH RemovedActions AS (
        SELECT DISTINCT CAST(LTRIM(RTRIM(d.value)) AS INT) AS ActionId
        FROM deleted del
        CROSS APPLY STRING_SPLIT(del.ActionList, ',') d
        EXCEPT
        SELECT DISTINCT CAST(LTRIM(RTRIM(i.value)) AS INT) AS ActionId
        FROM inserted ins
        CROSS APPLY STRING_SPLIT(ins.ActionList, ',') i
    )

    UPDATE rp
    SET
        rp.can_View    = 0,
        rp.isActive    = 0,
        rp.deletedDate = GETDATE(),
		rp.lastModify='D',
		rp.createdBy=@createdBy
    FROM RoleFormsPermissions rp
    JOIN RemovedActions ra
        ON ra.ActionId = rp.ActionId
    WHERE rp.formId   = @FormId
      AND rp.moduleId = @ModuleId;

END;
GO
ALTER TABLE [dbo].[formMaster] ENABLE TRIGGER [trg_FormMaster_RoleFormPermission_ActionSync]
GO
/****** Object:  Trigger [dbo].[Trigger_Update_Registration]    Script Date: 05-06-2026 14:19:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE Trigger [dbo].[Trigger_Update_Registration] on [dbo].[Registration]
	FOR UPDATE
as declare @Emp_id varchar(50),
@Emp_name varchar(50),
@Address varchar(50),
@City_id varchar(50),
@City varchar(50),
@State varchar(50),
@Pincode varchar(50),
@Email varchar(50),
@Password varchar(50),
@Mobile varchar(50),
@Birthdate varchar(50),
@IP_address varchar(50),
@IsActive varchar(50),
@U_id varchar(50),
@Role_id varchar(50),
@Fc_id varchar(50),
@College_id varchar(50),
@Desig_id varchar(50),
@Emp_code varchar(50),
@Is_delete varchar(50),
@Note varchar(50),

@Emp_name_Old varchar(50),
@Address_Old varchar(50),
@City_id_Old varchar(50),
@City_Old varchar(50),
@State_Old varchar(50),
@Pincode_Old varchar(50),
@Email_Old varchar(50),
@Password_Old varchar(50),
@Mobile_Old varchar(50),
@Birthdate_Old varchar(50),
@IP_address_Old varchar(50),
@IsActive_Old varchar(50),
@U_id_Old varchar(50),
@Role_id_Old varchar(50),
@Fc_id_Old varchar(50),
@College_id_Old varchar(50),
@Desig_id_Old varchar(50),
@Emp_code_Old varchar(50),
@Note_Old varchar(50),

@FormName varchar(50);

select @Emp_id=i.Empid from inserted i;
select @Emp_name=i.Emp_name from inserted i;
select @Address=i.Address from inserted i;
select @City_id=i.City_id from inserted i;
select @City=i.City from inserted i;
select @State=i.State from inserted i;
select @Pincode=i.Pincode from inserted i;
select @Email=i.Email from inserted i;
select @Password=i.Password from inserted i;
select @Mobile=i.Mobile from inserted i;
select @Birthdate=i.Birthdate from inserted i;
select @IP_address=i.IP_address from inserted i;
select @IsActive=i.IsActive from inserted i;
select @U_id=i.U_id from inserted i;
select @Role_id=i.Role_id from inserted i;
select @Fc_id=i.Fc_id from inserted i;

select @College_id=i.College_id from inserted i;
select @Desig_id=i.Desig_id from inserted i;
select @Emp_code=i.Emp_code from inserted i;
select @Is_delete=i.Is_delete from inserted i;
select @Note=i.Note from inserted i;
select @FormName=i.FormName from inserted i;

select @Emp_name_Old=i.Emp_name from deleted i;
select @Address_Old=i.Address from deleted i;
select @City_id_Old=i.City_id from deleted i;
select @City_Old=i.City from deleted i;
select @State_Old=i.State from deleted i;
select @Pincode_Old=i.Pincode from deleted i;
select @Email_Old=i.Email from deleted i;
select @Password_Old=i.Password from deleted i;
select @Mobile_Old=i.Mobile from deleted i;
select @Birthdate_Old=i.Birthdate from deleted i;
select @IP_address_Old=i.IP_address from deleted i;
select @IsActive_Old=i.IsActive from deleted i;
select @U_id_Old=i.U_id from deleted i;
select @Role_id_Old=i.Role_id from deleted i;
select @Fc_id_Old=i.Fc_id from deleted i;
select @College_id_Old=i.College_id from deleted i;
select @Desig_id_Old=i.Desig_id from deleted i;
select @Emp_code_Old=i.Emp_code from deleted i;
select @Note_Old=i.Note from deleted i;


if @Is_delete = 'Y'
Begin

insert into [AAU@EXMAS_LOG].[dbo].[Registration] (Emp_id,Emp_name,Address,City_id,City,State,Pincode,Email,
Password,Mobile,Birthdate,IP_address,IsActive,U_id,Role_id,Fc_id,College_id,Desig_id,Emp_code,Note,Audit_DateTime,FormName,Audit_Action)
values(@Emp_id,@Emp_name,@Address,@City_id,@City,@State,@Pincode,@Email,
@Password,@Mobile,@Birthdate,@IP_address,@IsActive,@U_id,@Role_id,@Fc_id,@College_id,@Desig_id,@Emp_code,@Note,GETDATE(),@FormName,'Delete')

End
Else
Begin

--update EmpMergeTable set Role_id=@Role_id,College_id=@College_id,Fc_id=@Fc_id,Desig_id=@Desig_id,Emp_code=@Emp_code where Emp_id_Old=@Emp_id and Primary_Emp_Id=@Emp_id

DECLARE @valueList varchar(MAX);
DECLARE @ColumnList varchar(MAX);
	Set @valueList ='';
	Set @ColumnList ='';

	if @Emp_name_Old <> @Emp_name
	BEGIN
	Set @valueList = @valueList + '[ Emp_name : '+ @Emp_name +' ] '
	END

	if @Address_Old <> @Address
	BEGIN
	Set @valueList = @valueList + '[ Address : '+ @Address +' ] '
	END

	if @City_id_Old <> @City_id
	BEGIN
	Set @valueList = @valueList + '[ City_id : '+ @City_id +' ] '
	END

	if @City_Old <> @City
	BEGIN
	Set @valueList = @valueList + '[ City : '+ @City +' ] '
	END

	if @State_Old <> @State
	BEGIN
	Set @valueList = @valueList + '[ State : '+ @State +' ] '
	END

	if @Pincode_Old <> @Pincode
	BEGIN
	Set @valueList = @valueList + '[ Pincode : '+ @Pincode +' ] '
	END

	if @Email_Old <> @Email
	BEGIN
	Set @valueList = @valueList + '[ Email : '+ @Email +' ] '
	END

	if @Password_Old <> @Password
	BEGIN
	Set @valueList = @valueList + '[ Password : '+ @Password +' ] '
	END

	if @Mobile_Old <> @Mobile
	BEGIN
	Set @valueList = @valueList + '[ Mobile : '+ @Mobile +' ] '
	END

	if @Birthdate_Old <> @Birthdate
	BEGIN
	Set @valueList = @valueList + '[ Birthdate : '+ @Birthdate +' ] '
	END

	if @IP_address_Old <> @IP_address
	BEGIN
	Set @valueList = @valueList + '[ IP_address : '+ @IP_address +' ] '
	END

	if @U_id_Old <> @U_id
	BEGIN
	Set @valueList = @valueList + '[ U_id : '+ @U_id +' ] '
	END

	if @Role_id_Old <> @Role_id
	BEGIN
	Set @valueList = @valueList + '[ Role_id : '+ @Role_id +' ] '
	END

	if @Fc_id_Old <> @Fc_id
	BEGIN
	Set @valueList = @valueList + '[ Fc_id : '+ @Fc_id +' ] '
	END

	if @College_id_Old <> @College_id
	BEGIN
	Set @valueList = @valueList + '[ College_id : '+ @College_id +' ] '
	END

	if @Desig_id_Old <> @Desig_id
	BEGIN
	Set @valueList = @valueList + '[ Desig_id : '+ @Desig_id +' ] '
	END

	if @Emp_code_Old <> @Emp_code
	BEGIN
	Set @valueList = @valueList + '[ Emp_code : '+ @Emp_code +' ] '
	END

	if @Note_Old <> @Note
	BEGIN
	Set @valueList = @valueList + '[ Note : '+ @Note +' ] '
	END

	


insert into [AAU@EXMAS_LOG].[dbo].[Registration] (Emp_id,Emp_name,Address,City_id,City,State,Pincode,Email,
Password,Mobile,Birthdate,IP_address,IsActive,U_id,Role_id,Fc_id,College_id,Desig_id,Emp_code,Note,Audit_DateTime,FormName,Audit_Action,Fields_Affected)
values(@Emp_id,@Emp_name,@Address,@City_id,@City,@State,@Pincode,@Email,
@Password,@Mobile,@Birthdate,@IP_address,@IsActive,@U_id,@Role_id,@Fc_id,@College_id,@Desig_id,@Emp_code,@Note,GETDATE(),@FormName,'Update',@valueList)

End



-- Update Code End

GO
ALTER TABLE [dbo].[Registration] ENABLE TRIGGER [Trigger_Update_Registration]
GO
USE [master]
GO
ALTER DATABASE [SecureLoginRBAC] SET  READ_WRITE 
GO
