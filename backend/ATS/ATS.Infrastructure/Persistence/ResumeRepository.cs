using ATS.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ATS.Infrastructure.Persistence
{
    public class ResumeRepository : Repository<Resume>, IResumeRepository
    {
        public ResumeRepository(AppDbContext context) : base(context) { }

        public async Task<List<Resume>> GetByCandidateAsync(Guid candidateId)
        {
            return await _dbSet
                .Where(r => r.CandidateId == candidateId)
                .ToListAsync();
        }
    }
}
