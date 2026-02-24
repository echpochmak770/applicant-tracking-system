using ATS.Domain.Interfaces;
using ATS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Infrastructure.Helpers
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IApplicationHistoryRepository, ApplicationHistoryRepository>();
            services.AddScoped<IApplicationRepository, ApplicationRepository>();
            services.AddScoped<ICandidateRepository, CandidateRepository>();
            services.AddScoped<ICommunicationRepository, CommunicationRepository>();
            services.AddScoped<IResumeRepository, ResumeRepository>();
            services.AddScoped<IStageRepository, StageRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IVacancyRepository, VacancyRepository>();

            return services;
        }
    }
}
