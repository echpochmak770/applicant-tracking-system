using ATS.Shared.Classes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ATS.Infrastructure.Authentication;
using ATS.Core.Features.Auth.Interfaces;

namespace ATS.WebApi.Helpers
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
        {
            AddCorsPolicy(services);
            AddJwtAuthentication(services, configuration);
            services.AddAuthorization();
            services.AddScoped<IAuthService, AuthService>();
            return services;
        }

        private static void AddCorsPolicy(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("https://localhost:5173")
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });
        }

        private static void AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();

            ValidateJwtSettings(jwtSettings);

            services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

            var key = Encoding.UTF8.GetBytes(jwtSettings.Secret);

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ClockSkew = TimeSpan.FromMinutes(1)
                    };
                });
        }

        private static void ValidateJwtSettings(JwtSettings? jwtSettings)
        {
            if (jwtSettings == null)
                throw new InvalidOperationException("JWT configuration section is missing");

            if (string.IsNullOrEmpty(jwtSettings.Secret))
                throw new InvalidOperationException("JWT Secret is not configured");

            if (jwtSettings.Secret.Length < 32)
                throw new InvalidOperationException("JWT Secret must be at least 32 characters long");
        }
    }
}
