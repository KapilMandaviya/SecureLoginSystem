
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace SecureLoginRBAC.Authorize
{

    public class PermissionPolicyProvider : IAuthorizationPolicyProvider
    {
        private readonly DefaultAuthorizationPolicyProvider _fallback;

        public PermissionPolicyProvider(IOptions<AuthorizationOptions> options)
        {
            _fallback = new DefaultAuthorizationPolicyProvider(options);
        }

        //public Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
        //{
        //    if (policyName.StartsWith("Permission:", StringComparison.OrdinalIgnoreCase))
        //    {
        //        var permission = policyName.Substring("Permission:".Length);

        //        var policy = new AuthorizationPolicyBuilder()
        //            .AddRequirements(new PermissionRequirement(permission))
        //            .Build();

        //        return Task.FromResult(policy);
        //    }

        //    return _fallback.GetPolicyAsync(policyName);
        //}

        public Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
        {
            var policy = new AuthorizationPolicyBuilder()
                .AddRequirements(new PermissionRequirement(policyName))
                .Build();

            return Task.FromResult(policy);
        }


        public Task<AuthorizationPolicy> GetDefaultPolicyAsync()
            => _fallback.GetDefaultPolicyAsync();

        public Task<AuthorizationPolicy?> GetFallbackPolicyAsync()
            => _fallback.GetFallbackPolicyAsync();
    }

}

