using ATS.Shared.Classes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ATS.Infrastructure.Authentication;
using ATS.UseCases.Features.Auth.Interfaces;
using Microsoft.EntityFrameworkCore;
using ATS.Infrastructure.Persistence;
using ATS.Domain.Interfaces;

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
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            return services;
        }

        public static void ApplyMigrations(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<AppDbContext>();

            int retries = 10;
            while (retries > 0)
            {
                try
                {
                    if (context.Database.CanConnect())
                    {
                        var pendingMigrations = context.Database.GetPendingMigrations();
                        if (pendingMigrations.Any())
                        {
                            context.Database.Migrate();
                            Console.WriteLine("--> Database migration applied successfully.");
                        }
                        else
                        {
                            Console.WriteLine("--> No pending migrations found.");
                        }
                        break;
                    }
                    throw new Exception("Database is not reachable");
                }
                catch (Exception ex)
                {
                    retries--;
                    Console.WriteLine($"--> Database not ready yet, retrying... ({retries} left).");
                    Task.Delay(5000);

                    if (retries == 0)
                    {
                        Console.WriteLine($"--> Could not connect to database after several attempts: {ex.Message}");
                        throw;
                    }
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

                        ClockSkew = TimeSpan.FromSeconds(30)
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