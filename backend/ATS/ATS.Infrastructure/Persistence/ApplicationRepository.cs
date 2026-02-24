using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ATS.Infrastructure.Persistence
{
    public class ApplicationRepository : Repository<Application>, IApplicationRepository
    {
        public ApplicationRepository(AppDbContext dbContext) : base(dbContext) { }

        public async Task<List<Application>> GetByCandidateAsync(Guid candidateId)
        {
            return await _dbSet
                .Where(a => a.CandidateId == candidateId)
                .Include(a => a.Vacancy)
                .Include(a => a.CurrentStage)
                .ToListAsync();
        }

        public async Task<List<Application>> GetByVacancyAsync(Guid vacancyId)
        {
            return await _dbSet
                .Where(a => a.VacancyId == vacancyId)
                .Include(a => a.Candidate)
                .Include(a => a.CurrentStage)
                .ToListAsync();
        }

        public async Task<Application?> GetWithDetailsAsync(Guid id)
        {
            return await _dbSet
                .Include(a => a.Candidate)
                .Include(a => a.Vacancy)
                .Include(a => a.CurrentStage)
                .Include(a => a.Resume)
                .Include(a => a.Histories)
                .Include(a => a.Communications)
                .FirstOrDefaultAsync(a => a.Id == id);
        }
    }
}
