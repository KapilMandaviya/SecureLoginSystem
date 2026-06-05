using System.Security.Cryptography;
using System.Text;

namespace UtilityLayer
{

    public static class Otp_Hash_Generate
    {
        // 6-digit numeric OTP
        public static string GenerateOtp()
        {
            using var rng = RandomNumberGenerator.Create();
            byte[] bytes = new byte[6];
            rng.GetBytes(bytes);

            int value = BitConverter.ToInt32(bytes, 0) % 1000000;
            value = Math.Abs(value);

            return value.ToString("D6");
        }

        // Hash OTP before storing
        public static string HashOtp(string otp)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(otp);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

       
    }
}

