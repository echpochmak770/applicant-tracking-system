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

        public async Task<List<ApplicationHistory>> GetByApplicationAsync(Guid applicationId)
        {
            return await _dbSet
                .Where(ah => ah.ApplicationId == applicationId)
                .Include(ah => ah.FromStage)
                .Include(ah => ah.ToStage)
                .Include(ah => ah.CreatedAt)
                .Include(ah => ah.ChangedAt)
                .ToListAsync();
        }
    }
}
