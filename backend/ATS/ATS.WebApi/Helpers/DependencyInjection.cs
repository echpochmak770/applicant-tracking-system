using ATS.Shared.Classes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ATS.Infrastructure.Authentication;
using ATS.UseCases.Features.Auth.Interfaces;
using Microsoft.EntityFrameworkCore;
using ATS.Infrastructure.Persistence;

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

        public static void ApplyMigrations(this IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<AppDbContext>();

                    if (context.Database.GetPendingMigrations().Any() || !context.Database.CanConnect())
                    {
                        context.Database.Migrate();
                        Console.WriteLine("--> Database migration applied successfully.");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"--> Could not run migrations: {ex.Message}");
                }
            }
        }

        private static void AddCorsPolicy(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("https://localhost:5173", "http://localhost:5173")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
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
                        ValidateAudience = true,
                        ValidateIssuer = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = jwtSettings.Issuer,
                        ValidAudience = jwtSettings.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtSettings.Secret)),

                        ClockSkew = TimeSpan.Zero
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var token = context.Request.Cookies["accessToken"];
                            if (!string.IsNullOrEmpty(token))
                            {
                                context.Token = token;
                            }

                            return Task.CompletedTask;
                        }
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