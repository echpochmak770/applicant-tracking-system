using ATS.Domain.Interfaces;
using ATS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ATS.WebApi.Helpers
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services)
        {
            AddCorsPolicy(services);

            return services;
        }

        private static void AddCorsPolicy(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("https://localhost:3000")
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });
        }
    }
}
