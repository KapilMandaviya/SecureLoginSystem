using BusinessLogic.BS_EmailCommonRepo.Interface;
using BusinessLogic.BS_MasterRepo.Interface;
using BusinessLogic.BS_SuperAdminRepo.Interface;
using DtoLayer;
using RepositoryLayer.AuthnticateRepo.Interface;
using UtilityLayer;
using UtilityLayer.CaptchaStringGenerate;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using OtpNet;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using System.Security.Claims;


    namespace SecureLoginRBAC.Controllers.Authentication
{
    public class LoginController : Controller
    {
        private readonly IBS_AuthnticateLogin _AuthnticateLogin;
        private readonly IBS_OTPVerifyService _EmailService;
        private readonly IBS_EmailConfig _emailConfig;
        private readonly IBS_SAAuthSetting _SAAuthSetting;
        private readonly IBS_RoleMasterRepo _roleBSRepo;
        private readonly IBS_AcademicYearRepo _currenYearRepo;

        public LoginController(IBS_AuthnticateLogin AuthnticateLogin, IBS_OTPVerifyService emailService,
              IBS_SAAuthSetting SAAuthSetting, IBS_EmailConfig emailConfig, IBS_RoleMasterRepo bS_Role, IBS_AcademicYearRepo currenYearRepo)
        {
            _AuthnticateLogin = AuthnticateLogin;
            _EmailService = emailService;
            _emailConfig = emailConfig;
            _SAAuthSetting = SAAuthSetting;
            _roleBSRepo = bS_Role;
            _currenYearRepo = currenYearRepo;
        }
        public IActionResult AccessDenied()
        {
            
            return View();
        }

        public IActionResult Generate()
        {
            string captchaText = CaptchaStringGenerate.GenerateRandomText(5);
            HttpContext.Session.SetString("CaptchaCode", captchaText);

            int width = 140;
            int height = 45;

            using var bmp = new Bitmap(width, height);
            using var gfx = Graphics.FromImage(bmp);
            var rand = new Random();

            gfx.Clear(Color.White);

            // 🔹 Draw noise lines
            for (int i = 0; i < 6; i++)
            {
                using var pen = new Pen(Color.LightGray, 1);
                gfx.DrawLine(pen,
                    rand.Next(width), rand.Next(height),
                    rand.Next(width), rand.Next(height));
            }

            // 🔹 Draw captcha characters (random position & rotation)
            int x = 10;
            foreach (char c in captchaText)
            {
                using var font = new System.Drawing.Font("Arial", 20, FontStyle.Bold);
                using var brush = new SolidBrush(Color.FromArgb(
                    rand.Next(50, 150),
                    rand.Next(50, 150),
                    rand.Next(50, 150)));

                float y = rand.Next(5, 15);
                float angle = rand.Next(-20, 20);

                gfx.TranslateTransform(x, y);
                gfx.RotateTransform(angle);
                gfx.DrawString(c.ToString(), font, brush, 0, 0);
                gfx.ResetTransform();

                x += 25;
            }

            // 🔹 Draw random dots
            for (int i = 0; i < 100; i++)
            {
                bmp.SetPixel(rand.Next(width), rand.Next(height),
                    Color.FromArgb(rand.Next(150), rand.Next(150), rand.Next(150)));
            }

            using var ms = new MemoryStream();
            bmp.Save(ms, ImageFormat.Png);

            return File(ms.ToArray(), "image/png");
        }


        public async Task<IActionResult> Login()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Dashboard", "Home");
            }
            else
            {
                //  var authSetting =await _AuthnticateLogin.getBS_ListOfAuthSetting();
                //ViewBag.AuthSettings = authSetting; // store in ViewBag

                //}
                try
                {
                    var authSettings = await _AuthnticateLogin.getBS_ListOfAuthSetting(); // DB call
                    ViewBag.AuthSettings = authSettings;
                    return View();
                }
                catch (Exception ex)
                {

                    throw;
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] RegistrationDto dto)
        {
            var message = await _AuthnticateLogin.validateLogin(dto);

            if (message.result == 1 && message.user.EmpId is not null)
            {
                // setting the session
                HttpContext.Session.SetString("email", message.user.Email);
                HttpContext.Session.SetString("EmpId", message.user.EmpId?.ToString() ?? "0");
                HttpContext.Session.SetString("roleId", message.user.RoleId?.ToString() ?? "0");

            }
            return Json(new
            {
                result = message.result,
                message = message.errorMessage
            });
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Login");
        }

        [HttpPost]
        public IActionResult VerifyCaptcha(string captcha)
        {
            var sessionCaptcha = HttpContext.Session.GetString("CaptchaCode");

            if (string.IsNullOrEmpty(sessionCaptcha))
                return Json(false);

            return Json(captcha?.Equals(sessionCaptcha) == true);
        }

        [HttpGet]
        public async Task<IActionResult> GetAuthSettings()
        {
            var authSettings = await _AuthnticateLogin.getBS_ListOfAuthSetting();
            return Json(authSettings);
        }

        public (string secret, string qrCodeBase64) GenerateSetupCode(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentNullException("email");
            }


            // Generate a unique secret and store it
            byte[] secretKeyByte = KeyGeneration.GenerateRandomKey(20); // using for random key generation

            // convert it to string format (base32)
            string base32Secret = Base32Encoding.ToString(secretKeyByte);

            // Store it in session to use for otp
            //HttpContext.Session.SetString("secretKey", base32Secret);

            var totpUri =
                $"otpauth://totp/MyApp:{email}?secret={base32Secret}&issuer=MyApp";

            using var qrGenerator = new QRCodeGenerator();
            var qrData = qrGenerator.CreateQrCode(totpUri, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new Base64QRCode(qrData);
            var qrBase64 = qrCode.GetGraphic(5);

            return (base32Secret, qrBase64);
        }

        [HttpGet]
        public async Task<IActionResult> GenerateTwoFactorQR()
        {
            string? email = HttpContext.Session.GetString("email");
            if (string.IsNullOrEmpty(email))
            {
                email = "19mca001@gardividyapith.ac.in";
                // return BadRequest("Email not found");
            }

            if (string.IsNullOrEmpty(email))
                return Json(new { success = false, message = "Session expired" });

            var user = await _AuthnticateLogin.getRegistrationDetails(email);
            if (user == null)
                return BadRequest("User not found");

            var user2FA = await _AuthnticateLogin.getUserTwoFactorDto(user.EmpId ?? 0);

            // 🔐 CASE 1: 2FA verified → OTP screen
            if (user2FA != null && user2FA.IsEnabled == true)
            {
                return Json(new
                {
                    success = true,
                    stage = "verify"
                });
            }

            // 🔐 CASE 2: Secret exists → QR screen (regenerate QR)
            if (user2FA != null && user2FA.IsEnabled == false)
            {
                var qrBase64 = GenerateQrFromSecret(email, user2FA.SecretKey);

                return Json(new
                {
                    success = true,
                    isEnabled = false,
                    stage = "qr",
                    qrCode = $"data:image/png;base64,{qrBase64}",
                    manualKey = user2FA.SecretKey,
                    issuer = "MyApp",
                    account = email
                });
            }

            // 🔐 CASE 3: Fresh user → create secret + QR
            var (secret, qrCodeBase64) = GenerateSetupCode(email);

            await _AuthnticateLogin.saveTwoFactorDetails(new UserTwoFactorDto
            {
                EmpId = user.EmpId,
                SecretKey = secret,
                IsEnabled = false,
                CreatedAt = DateTime.UtcNow
            });

            return Json(new
            {
                success = true,
                isEnabled = false,
                stage = "qr",
                qrCode = $"data:image/png;base64,{qrCodeBase64}",
                manualKey = secret,
                issuer = "MyApp",
                account = email
            });
        }



        [HttpPost]
        public async Task<IActionResult> VerifyTwoFactorCode(string otp)
        {
            if (string.IsNullOrEmpty(otp))
            {
                return Json(new { success = false, message = "OTP is required" });
            }

            string? email = HttpContext.Session.GetString("email");
            if (string.IsNullOrEmpty(email))
            {
                email = "19mca001@gardividyapith.ac.in";
                // return BadRequest("Email not found");
            }
            if (string.IsNullOrEmpty(email))
            {
                return Json(new { success = false, message = "Session expired" });
            }


            // Get user from DB
            var user = await _AuthnticateLogin.getRegistrationDetails(email);
            if (user == null) return BadRequest("User not found");

            var user2FA = await _AuthnticateLogin.getUserTwoFactorDto(user.EmpId ?? 0);


            //var secretKey = HttpContext.Session.GetString("secretKey");

            if (string.IsNullOrEmpty(user2FA.SecretKey))
            {
                return Json(new { success = false, message = "Session expired. Please re-scan QR." });
            }

            var totp = new Totp(Base32Encoding.ToBytes(user2FA.SecretKey));

            //update verify true
            await _AuthnticateLogin.updateTwoFactor(user2FA);

            bool isValid = totp.VerifyTotp(
                  otp,
                  out long timeStepMatched,
                  new VerificationWindow(previous: 0, future: 0)
              );


            if (!isValid)
            {
                return Json(new { success = false, message = "Invalid OTP" });
            }

            // ✅ Mark 2FA verified (session/db)
            HttpContext.Session.SetString("TwoFactorVerified", "true");

            return Json(new { success = true });
        }

        [HttpPost]
        public async Task<IActionResult> ResetTwoFactorForNewDevice()
        {
            string? email = HttpContext.Session.GetString("email");
            if (string.IsNullOrEmpty(email))
            {
                email = "19mca001@gardividyapith.ac.in";
                // return BadRequest("Email not found");
            }

            if (string.IsNullOrEmpty(email))
            {
                return Json(new { success = false, message = "Session expired" });
            }


            // Get user from DB
            var user = await _AuthnticateLogin.getRegistrationDetails(email);
            if (user == null) return BadRequest("User not found");



            var user2FA = await _AuthnticateLogin.clearTwoFactorDetails(user.EmpId);
            bool result = user2FA.result == 1 ? true : false;


            // Clear session flags
            HttpContext.Session.Remove("TwoFactorVerified");


            return Json(new { success = result, message = user2FA.errorMessage });
        }

        private string GenerateQrFromSecret(string email, string base32Secret)
        {
            var totpUri =
                $"otpauth://totp/MyApp:{email}?secret={base32Secret}&issuer=MyApp";

            using var qrGenerator = new QRCodeGenerator();
            var qrData = qrGenerator.CreateQrCode(totpUri, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new Base64QRCode(qrData);

            return qrCode.GetGraphic(5);
        }

        [HttpPost]
        public async Task<IActionResult> FinalizeLogin()
        {
            var email = HttpContext.Session.GetString("email");
            var empIdString = HttpContext.Session.GetString("EmpId");
            var roleIdString = HttpContext.Session.GetString("roleId");

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(empIdString))
                return Unauthorized();

            var userId = Convert.ToInt32(empIdString);
            var roleId = Convert.ToInt32(roleIdString);

            var currentAcYear = await _currenYearRepo.GetCurrentAcademicYearAsync();
            // 1️⃣ Base identity claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, email),
                new Claim("EmpId", empIdString),
                new Claim("roleId", roleIdString),
                new Claim("CurrentAcYear", currentAcYear.CurrentAcYear.ToString()),
                new Claim("CurrentAcYearID", currentAcYear.Id.ToString())
            };

            // 2️⃣ Load permissions from DB
            var permissionData = await _roleBSRepo.GetPermissionsByEmpId(userId,roleId);

            // 3️⃣ Add permission claims
           claims.AddRange(BuildPermissionClaims(permissionData));

            // 4️⃣ Create identity + principal (COOKIE AUTH ONLY)
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            // 5️⃣ Sign in ONCE
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal
              );

            return Ok();
        }


        [HttpPost]
        public async Task<IActionResult> SendEmailOtp([FromBody] string type)
        {

            var otp = Otp_Hash_Generate.GenerateOtp();
            var otpHash = Otp_Hash_Generate.HashOtp(otp);
            var toEmail = HttpContext.Session.GetString("email");
            var EmpId = HttpContext.Session.GetString("EmpId");

            var authSetting = await _SAAuthSetting.fetchAllAsyncByAuthCode("EMAIL_VERIFY");
            var entity = new UserLoginOtpDto
            {
                EmpId = int.Parse(EmpId),
                Email = toEmail,
                OtpHash = otpHash,
                OtpType = type,
                ExpiryTime = DateTime.Now.AddMinutes(authSetting.OtpexpiryTime ?? 30)
            };

            var saveResult = await _EmailService.SaveEmailOtpAsync(entity);

            if (saveResult.result == false)
            {
                return Json(new
                {
                    success = false,
                    message = saveResult.errorMessage,
                    otp=otp
                });
            }

            var emailConfig = await _emailConfig.GetEmailConfigValueAsync();
            var emailResult = await EmailUtility.SendAsync(
           toEmail,
           "Your Login OTP",
           EmailUtility.EmailOtp(otp),
           emailConfig.Email,
           emailConfig.AppPassword,
           emailConfig.SmtpPort,
           emailConfig.SmtpServer
       );

            if (!emailResult.result)
            {
                return Json(new
                {
                    success = false,
                    message = emailResult.errorMessage,
                    otp = otp
                });
            }

            // ✅ Both successful
            return Json(new
            {
                success = true,
                message = "OTP has been sent successfully to your email.",
                otp = otp
            });


        }

        [HttpPost]
        public async Task<IActionResult> VerifyEmailOtp([FromBody] VerifyOtpRequest verifyOtp)
        {
            if (string.IsNullOrEmpty(verifyOtp.Otp))
                return Ok(new { success = false, message = "OTP is required" });


            var EmpId = HttpContext.Session.GetString("EmpId");

            if (string.IsNullOrEmpty(EmpId))
                return Ok(new { success = false, message = "Session expired. Please login again." });

            // 1️⃣ Get latest OTP record from DB
            var savedOtp = await _EmailService.GetValidEmailOtpAsync(
                int.Parse(EmpId ?? "0")
            );

            if (savedOtp == null)
                return Ok(new { success = false, message = "OTP not found" });

            // 2️⃣ Check expiry
            if (savedOtp.ExpiryTime < DateTime.Now)
                return Ok(new { success = false, message = "OTP has expired" });

            // 3️⃣ Hash user entered OTP
            var enteredOtpHash = Otp_Hash_Generate.HashOtp(verifyOtp.Otp);

            // 4️⃣ Compare hash
            if (enteredOtpHash != savedOtp.OtpHash)
                return Ok(new { success = false, message = "Invalid OTP" });

            var (result, errorMessage) = await _EmailService.MarkOtpUsedAsync(savedOtp.Id);
            

            //bool success = result != 0;
            return Ok(new
            {
                success = result,
                message = errorMessage
            });

        }


        //[HttpPost]
        //public IActionResult SendMobileOtp()
        //{
        //    var email = HttpContext.Session.GetString("PendingLoginEmail");
        //    if (string.IsNullOrEmpty(email))
        //        return Unauthorized();

        //    var mobile = _userService.GetMobileByEmail(email);
        //    _otpService.SendSmsOtp(mobile);

        //    return Ok(new { success = true });
        //}

        //private List<Claim> BuildPermissionClaims(List<UserPermissionDto> permissions)
        //{
        //    var claims = new List<Claim>();

        //    foreach (var p in permissions)
        //    {
        //        if (p.CanFull)
        //        {
        //            claims.Add(new Claim("permission", $"{p.FormCode}.Full"));
        //            continue;
        //        }

        //        if (p.CanView)
        //            claims.Add(new Claim("permission", $"{p.FormCode}.View"));

        //        if (p.CanAdd)
        //            claims.Add(new Claim("permission", $"{p.FormCode}.Add"));

        //        if (p.CanEdit)
        //            claims.Add(new Claim("permission", $"{p.FormCode}.Edit"));

        //        if (p.CanDelete)
        //            claims.Add(new Claim("permission", $"{p.FormCode}.Delete"));

        //        if (p.CanPrint)
        //            claims.Add(new Claim("permission", $"{p.FormCode}.Print"));
        //    }

        //    return claims;
        //}

        //private List<Claim> BuildPermissionClaims(List<UserPermissionDto> permissions)
        //{
        //    var claims = new List<Claim>();

        //    foreach (var p in permissions)
        //    {
        //        var formKey = PermissionKeyHelper.Normalize(p.FormCode);

        //        if (string.IsNullOrEmpty(formKey))
        //            continue;

        //        if (p.CanFull)
        //        {
        //            claims.Add(new Claim("permission", $"{formKey}.Full"));
        //        }

        //        if (p.CanView)
        //            claims.Add(new Claim("permission", $"{formKey}.View"));

        //        if (p.CanAdd)
        //            claims.Add(new Claim("permission", $"{formKey}.Add"));

        //        if (p.CanEdit)
        //            claims.Add(new Claim("permission", $"{formKey}.Edit"));

        //        if (p.CanDelete)
        //            claims.Add(new Claim("permission", $"{formKey}.Delete"));

        //        if (p.CanPrint)
        //            claims.Add(new Claim("permission", $"{formKey}.Print"));
        //    }

        //    return claims;
        //}

        private List<Claim> BuildPermissionClaims(IEnumerable<FormPermissionDto> formPermissions)
        {
            return formPermissions
                .SelectMany(fp => fp.Permissions.Values)            // flatten permission keys
                .Where(pk => !string.IsNullOrWhiteSpace(pk))        // safety check
                .Select(pk => new Claim("permission", pk))          // create claims
                .DistinctBy(c => c.Value)                           // remove duplicates
                .ToList();
        }




        public async Task RefreshUserClaimsAsync(HttpContext httpContext, int userId, int roleId)
        {
            // Remove old cookie
            await httpContext.SignOutAsync("Cookies");

            // Get latest permissions
            var permissionData = await _roleBSRepo.GetPermissionsByEmpId(userId, roleId);

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        new Claim("roleId", roleId.ToString())
    };

            claims.AddRange(BuildPermissionClaims(permissionData));

            var identity = new ClaimsIdentity(claims, "Cookies");
            var principal = new ClaimsPrincipal(identity);

            await httpContext.SignInAsync("Cookies", principal);
        }




    }
}
