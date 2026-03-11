using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ATS.Infrastructure.Persistence
{
    public class ApplicationHistoryRepository : Repository<ApplicationHistory>, IApplicationHistoryRepository
    {
        public ApplicationHistoryRepository(AppDbContext context) : base(context) { }

        public async Task<List<ApplicationHistory>> GetByApplicationAsync(
            Guid vacancyId,
            Guid applicationId,
            CancellationToken ct)
        {
            return await _dbSet
                .Include(h => h.FromStage)
                .Include(h => h.ToStage)
                .Include(h => h.ChangedBy)
                .Where(h => h.ApplicationId == applicationId && h.Application.VacancyId == vacancyId)
                .OrderByDescending(h => h.ChangedAt)
                .AsNoTracking()
                .ToListAsync(ct);
        }
    }
}
