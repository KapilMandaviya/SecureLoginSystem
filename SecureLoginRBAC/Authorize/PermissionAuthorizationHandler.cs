
using Microsoft.AspNetCore.Authorization;

namespace SecureLoginRBAC.Authorize
{
    public class PermissionAuthorizationHandler
    : AuthorizationHandler<PermissionRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            var hasPermission = context.User.Claims.Any(c =>
                c.Type == "permission" &&
                (c.Value == requirement.Permission ||
                 c.Value == requirement.Permission.Split('.')[0] + ".Full"));

            if (hasPermission)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }

}
