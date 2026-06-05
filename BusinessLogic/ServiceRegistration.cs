using RepositoryLayer.AuthnticateRepo.Interface;
using RepositoryLayer.MasterRepo.Interface;
using Microsoft.Extensions.DependencyInjection;


public static class ServiceRegistration
{
    public static void RegisterAllServices(this IServiceCollection services)
    {
        var assemblies = new[]
        {
            typeof(IBS_AuthnticateLogin).Assembly,   // Business Layer
            typeof(IAcademicYearRepo).Assembly   // Repository Layer
        };

        foreach (var assembly in assemblies)
        {
            var types = assembly.GetTypes();

            foreach (var type in types)
            {
                if (!type.IsClass || type.IsAbstract)
                    continue;

                var interfaces = type.GetInterfaces();

                foreach (var iface in interfaces)
                {
                    // Match: IBS_X → BS_X  and  IRepo → Repo
                    if (iface.Name == $"I{type.Name}")
                    {
                        services.AddScoped(iface, type);
                    }
                }
            }
        }
    }
}