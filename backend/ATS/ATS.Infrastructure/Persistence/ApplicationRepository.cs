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
                    EF.Functions.Like(a.Candidate.FirstName + " " + a.Candidate.LastName, $"%{search}%") ||
                    EF.Functions.Like(a.Candidate.Email, $"%{search}%"));
            }

            query = sortBy?.ToLower() switch
            {
                "name" => ApplySort(query, a => a.Candidate.FirstName + " " + a.Candidate.LastName, sortDirection),
                "email" => ApplySort(query, a => a.Candidate.Email, sortDirection),
                "stage" => ApplySort(query, a => a.CurrentStage.Order, sortDirection),
                _ => query.OrderByDescending(a => a.CreatedAt)
            };

            var totalCount = await query.CountAsync(ct);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);

            return (items, totalCount);
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

            historyQuery = sortBy?.ToLower() switch
            {
                "order" => ApplySort(historyQuery, h => h.ToStage.Order, sortDirection),
                "changedat" => ApplySort(historyQuery, h => h.ChangedAt, sortDirection),
                _ => historyQuery.OrderByDescending(h => h.ChangedAt)
            };

            var totalCount = await historyQuery.CountAsync(ct);

            var items = await historyQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);

            return (items, totalCount);
        }
    }
}
