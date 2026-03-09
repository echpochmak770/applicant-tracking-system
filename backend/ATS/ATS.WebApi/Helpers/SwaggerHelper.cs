using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi;
using System.Reflection;

namespace ATS.WebApi.Helpers
{
    public static class SwaggerExtensions
    {
        public static IServiceCollection AddSwaggerWithJwt(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "ATS API",
                    Version = "v1",
                    Description = "Applicant Tracking System API"
                });

                const string securitySchemeId = "Bearer";

                options.AddSecurityDefinition(securitySchemeId, new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    Description = "Введите JWT токен."
                });

                options.AddSecurityRequirement(document =>
                {
                    var securitySchemeRef =
                        new OpenApiSecuritySchemeReference(securitySchemeId, document);

                    return new OpenApiSecurityRequirement
                    {
                        [securitySchemeRef] = new List<string>()
                    };
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

                if (File.Exists(xmlPath))
                {
                    options.IncludeXmlComments(xmlPath);
                }
            });

            return services;
        }

        public static IApplicationBuilder UseSwaggerWithUI(this IApplicationBuilder app)
        {
            app.UseSwagger();

            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "ATS API v1");
                options.RoutePrefix = string.Empty;
                options.DocumentTitle = "ATS API Documentation";
            });

            return app;
        }
    }
}