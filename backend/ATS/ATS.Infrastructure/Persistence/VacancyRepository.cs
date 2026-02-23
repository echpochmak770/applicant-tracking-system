using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Infrastructure.Persistence
{
    public class VacancyRepository : Repository<Vacancy>, IVacancyRepository
    {
        public VacancyRepository(AppDbContext dbContext) : base(dbContext) { }

        public async Task<Vacancy?> GetFullAsync(Guid id)
        {
            return await _dbSet
                .Include(v => v.Stages)
                .Include(v => v.Applications)
                .ThenInclude(a => a.Candidate)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Vacancy?> GetWithStagesAsync(Guid id)
        {
            return await _dbSet
                .Include(v => v.Stages)
                .FirstOrDefaultAsync(v => v.Id == id);
        }
    }
}
