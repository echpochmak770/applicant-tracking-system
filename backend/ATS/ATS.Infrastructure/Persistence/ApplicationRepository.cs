using ATS.Domain.Common;
using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace ATS.Infrastructure.Persistence
{
    public class ApplicationRepository : Repository<Application>, IApplicationRepository
    {
        public ApplicationRepository(AppDbContext dbContext) : base(dbContext) { }

        protected override string MapSortField(string sortBy) => sortBy switch
        {
            "name" => "Candidate.FirstName",
            "email" => "Candidate.Email",
            "currentStageName" => "CurrentStage.Name",
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

        public async Task<(List<Application> Items, int Total)> GetByVacancyPagedAsync(
            Guid vacancyId,
            PagedQuery request,
            CancellationToken ct)
        {
            var query = _dbSet
                .Include(a => a.Candidate)
                .Include(a => a.CurrentStage)
                .Include(a => a.CreatedBy)
                .Include(a => a.Resume)
                .Where(a => a.VacancyId == vacancyId && !a.IsDeleted)
                .AsNoTracking();

            query = ApplyManualFilters(query, request.ColumnFilters);
            query = ApplySearch(query, request.Search);

            return await GetPagedDataAsync(query, request, ct);
        }

        private IQueryable<Application> ApplyManualFilters(IQueryable<Application> query, List<ColumnFilter>? filters)
        {
            if (filters == null || !filters.Any()) return query;

            foreach (var filter in filters)
            {
                if (string.IsNullOrWhiteSpace(filter.Filter)) continue;

                query = filter.Field switch
                {
                    "currentStageName" => query.Where(a => a.CurrentStage.Name.Contains(filter.Filter)),
                    "isDeleted" => query.Where(a => a.IsDeleted == bool.Parse(filter.Filter)),
                    "candidateFullName" => query.Where(a => (a.Candidate.FirstName + " " + a.Candidate.LastName).Contains(filter.Filter)),
                    _ => query
                };
            }

            return query;
        }

        private IQueryable<Application> ApplySearch(IQueryable<Application> query, string? search)
        {
            if (string.IsNullOrWhiteSpace(search)) return query;

            return query.Where(a =>
                a.Candidate.FirstName.Contains(search) ||
                a.Candidate.LastName.Contains(search) ||
                a.Candidate.Email.Contains(search));
        }

        public async Task<Application?> GetWithDetailsAsync(Guid id)
        {
            return await _context.Applications
                .Include(a => a.Candidate)
                .Include(a => a.CurrentStage)
                .Include(a => a.CreatedBy)
                .Include(a => a.Resume)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<(List<ApplicationHistory> Items, int Total)> GetStageHistoryPagedAsync(
            Guid vacancyId,
            Guid applicationId,
            PagedQuery request,
            CancellationToken ct)
        {
            var historyQuery = _dbSet
                .Where(a => a.Id == applicationId && a.VacancyId == vacancyId)
                .SelectMany(a => a.Histories)
                .Include(h => h.FromStage)
                .Include(h => h.ToStage)
                .Include(h => h.ChangedBy)
                .AsNoTracking();

            return await GetPagedDataAsync(historyQuery, request, ct);
        }
    }
}
