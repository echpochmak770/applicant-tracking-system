using ATS.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ATS.Infrastructure.Persistence
{
    public class StageRepository : Repository<Stage>, IStageRepository
    {
        public StageRepository(AppDbContext context) : base(context) { }

        public async Task<List<Stage>> GetByVacancyOrderedAsync(Guid vacancyId)
        {
            return await _dbSet
                .Where(s => s.VacancyId == vacancyId)
                .OrderBy(s => s.Order)
                .ToListAsync();
        }
    }
}
