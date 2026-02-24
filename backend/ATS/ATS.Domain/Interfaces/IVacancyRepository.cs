using ATS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface IVacancyRepository : IRepository<Vacancy>
    {
        Task<Vacancy?> GetWithStagesAsync(Guid id);
        Task<Vacancy?> GetFullAsync(Guid id);
    }
}
