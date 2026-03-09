using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Infrastructure.Persistence
{
    public class CommunicationRepository : Repository<Communication>, ICommunicationRepository
    {
        public CommunicationRepository(AppDbContext context) : base(context) { }

        public async Task<List<Communication>> GetByApplicationAsync(Guid applicationId)
        {
            return await _dbSet
                .Where(c => c.ApplicationId == applicationId)
                .Include(c => c.CreatedBy)
                .ToListAsync();
        }
    }
}
