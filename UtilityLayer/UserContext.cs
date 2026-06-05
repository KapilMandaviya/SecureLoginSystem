using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UtilityLayer
{
    public static class UserContext
    {
        private static IHttpContextAccessor _httpContextAccessor;

        // Initialize once at app startup
        public static void Configure(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public static int EmpId
        {
            get
            {
                var claim = _httpContextAccessor?
                    .HttpContext?
                    .User?
                    .FindFirst("EmpId");

                return claim != null ? int.Parse(claim.Value) : 0;
            }
        }

        public static int roleId
        {
            get
            {
                var claim = _httpContextAccessor?
                    .HttpContext?
                    .User?
                    .FindFirst("roleId");

                return claim != null ? int.Parse(claim.Value) : 0;
            }
        }

        public static string CurrentAcYear
        {
            get
            {
                var claim = _httpContextAccessor?
                    .HttpContext?
                    .User?
                    .FindFirst("CurrentAcYear");

                return claim != null ? claim.Value : "";
            }
        }

        public static int CurrentAcYearID
        {
            get
            {
                var claim = _httpContextAccessor?
                    .HttpContext?
                    .User?
                    .FindFirst("CurrentAcYearID");

                return claim != null ? int.Parse(claim.Value) : 0;
            }
        }
    }
}
