using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ATS.Infrastructure.Persistence
{
    public class CandidateRepository : Repository<Candidate>, ICandidateRepository
    {
        public CandidateRepository(AppDbContext dbContext) : base(dbContext) { }

        public async Task<Candidate?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Email == email);
        }

        public async Task<Candidate?> GetWithApplicationsAsync(Guid id)
        {
            return await _dbSet
                .Include(c => c.Applications)
                .ThenInclude(a => a.Vacancy)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}
