using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ATS.Infrastructure.Persistence
{
    public class ApplicationRepository : Repository<Application>, IApplicationRepository
    {
        public ApplicationRepository(AppDbContext dbContext) : base(dbContext) { }

        protected override string MapSortField(string sortBy) => sortBy switch
        {
            "name" => "Candidate.FirstName",
            "email" => "Candidate.Email",
            "stage" => "CurrentStage.Order",
            "order" => "ToStage.Order",
            _ => sortBy
        };

        public async Task<List<Application>> GetByCandidateAsync(Guid candidateId)
        {
            return await _dbSet
                .Where(a => a.CandidateId == candidateId && !a.IsDeleted)
                .Include(a => a.Vacancy)
                .Include(a => a.CurrentStage)
                .ToListAsync();
        }

        public async Task<List<Application>> GetByVacancyAsync(Guid vacancyId)
        {
            return await _dbSet
                .Where(a => a.VacancyId == vacancyId && !a.IsDeleted)
                .Include(a => a.Candidate)
                .Include(a => a.CurrentStage)
                .ToListAsync();
        }

        public async Task<(List<Application> Items, int TotalCount)> GetByVacancyPagedAsync(
            Guid vacancyId,
            string? search,
            string? sortBy,
            string? sortDirection,
            int page,
            int pageSize,
            CancellationToken ct)
        {
            var query = _dbSet
                .Include(a => a.Candidate)
                .Include(a => a.CurrentStage)
                .Include(a => a.CreatedBy)
                .Include(a => a.Resume)
                .Where(a => a.VacancyId == vacancyId && !a.IsDeleted)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a =>
                    EF.Functions.Like(a.Candidate.FirstName, $"%{search}%") ||
                    EF.Functions.Like(a.Candidate.LastName, $"%{search}%") ||
                    EF.Functions.Like(a.Candidate.Email, $"%{search}%"));
            }

            query = ApplyUniversalSorting(query, sortBy, sortDirection, "CreatedAt");

            return await GetPagedDataAsync(query, page, pageSize, ct);
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

        public async Task<(List<ApplicationHistory> Items, int TotalCount)> GetStageHistoryPagedAsync(
            Guid vacancyId,
            Guid applicationId,
            string? sortBy,
            string? sortDirection,
            int page,
            int pageSize,
            CancellationToken ct)
        {
            var historyQuery = _dbSet
                .Where(a => a.Id == applicationId && a.VacancyId == vacancyId)
                .SelectMany(a => a.Histories)
                .Include(h => h.FromStage)
                .Include(h => h.ToStage)
                .Include(h => h.ChangedBy)
                .AsNoTracking();

            historyQuery = ApplyUniversalSorting(historyQuery, sortBy, sortDirection, "ChangedAt");

            return await GetPagedDataAsync(historyQuery, page, pageSize, ct);
        }
    }
}
