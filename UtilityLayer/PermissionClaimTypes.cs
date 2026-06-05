using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UtilityLayer
{
    public static class PermissionClaimTypes
    {
        public const string Permission = "permission";
    }


    public static class PermissionKeyHelper
    {
        public static string Normalize(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return string.Empty;

            return input
                .Trim()
                .Replace(" ", "")   // remove spaces
                .Replace("-", "")
                .Replace("_", "");
        }

    }



}
