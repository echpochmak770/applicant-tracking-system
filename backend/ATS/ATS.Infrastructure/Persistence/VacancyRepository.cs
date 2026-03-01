using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Azure.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace ATS.Infrastructure.Persistence
{
    public class VacancyRepository : Repository<Vacancy>, IVacancyRepository
    {
        public VacancyRepository(AppDbContext dbContext) : base(dbContext) { }

        public async Task<(List<Vacancy> Items, int TotalCount)> GetAllPagedAsync(
            string? search,
            string? sortBy,
            string? sortDirection,
            int page,
            int pageSize,
            CancellationToken ct)
        {
            var query = _dbSet
                .Include(v => v.CreatedBy)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(v =>
                    EF.Functions.Like(v.Title, $"%{search}%") ||
                    EF.Functions.Like(v.Description, $"%{search}%") ||
                    EF.Functions.Like(v.CreatedBy.FirstName + " " + v.CreatedBy.LastName, $"%{search}%"));
            }

            query = sortBy?.ToLower() switch
            {
                "title" => ApplySort(query, v => v.Title, sortDirection),
                "createdat" => ApplySort(query, v => v.CreatedAt, sortDirection),
                "status" => ApplySort(query, v => v.Status, sortDirection),
                _ => query.OrderByDescending(v => v.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);

            return (items, totalCount);
        }

        public async Task<Vacancy?> GetFullAsync(Guid id)
        {
            return await _dbSet
                .Include(v => v.Stages)
                .Include(v => v.Applications)
                .ThenInclude(a => a.Candidate)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Vacancy?> GetWithStagesAsync(Guid id)
        {
            return await _dbSet
                .Include(v => v.Stages)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        private IQueryable<Vacancy> ApplySort<T>(
            IQueryable<Vacancy> query,
            Expression<Func<Vacancy, T>> keySelector,
            string? direction)
        {
            return direction?.ToLower() == "asc"
                ? query.OrderBy(keySelector)
                : query.OrderByDescending(keySelector);
        }
    }
}
