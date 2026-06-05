using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UtilityLayer.CaptchaStringGenerate
{
    public  class CaptchaStringGenerate
    {
        public static string GenerateRandomText(int length)
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            var rnd = new Random();
            var sb = new StringBuilder();
            for (int i = 0; i < length; i++)
                sb.Append(chars[rnd.Next(chars.Length)]);
            return sb.ToString();
        }
    }
}
