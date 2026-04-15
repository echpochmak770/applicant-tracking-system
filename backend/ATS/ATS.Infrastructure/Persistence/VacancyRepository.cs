using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.Domain.Common;
using ATS.UseCases.Helpers;
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

        protected override string MapSortField(string sortBy) => sortBy switch
        {
            "author" => "CreatedBy.FirstName",
            "status" => "Status",
            "title" => "Title",
            _ => sortBy
        };

        public async Task<(List<Vacancy> Items, int Total)> GetAllPagedAsync(PagedQuery request, CancellationToken ct)
        {
            var query = _context.Vacancies.AsNoTracking();

            if (request.ColumnFilters != null)
            {
                foreach (var filter in request.ColumnFilters)
                {
                    filter.Field = MapSortField(filter.Field);
                }
            }

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(v => v.Title.Contains(request.Search) ||
                                         v.Description.Contains(request.Search));
            }

            bool hasSort = request.ColumnFilters?.Any(f => !string.IsNullOrEmpty(f.Sort)) ?? false;

            if (!hasSort)
            {
                query = query.OrderBy(v => v.Status);
            }
            else
            {
                query = query.ApplyDynamicQuery(request);
            }

            var total = await query.CountAsync(ct);

            var items = await query
                .Include(v => v.CreatedBy)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(ct);

            return (items, total);
        }

        public async Task<Vacancy?> GetFullAsync(Guid id)
        {
            return await _dbSet
                .Include(v => v.Stages)
                .Include(v => v.Applications)
                .ThenInclude(a => a.Candidate)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Vacancy?> GetWithAuthorByIdAsync(Guid id)
        {
            return await _dbSet
                .Include(v => v.CreatedBy)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Vacancy?> GetWithStagesAsync(Guid id, CancellationToken cd)
        {
            return await _dbSet
                .Include(v => v.Stages)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task RemoveStagesAsync(IEnumerable<Guid> stageIds, CancellationToken ct)
        {
            var stages = await _context.Stages
                .Where(s => stageIds.Contains(s.Id))
                .ToListAsync(ct);

            _context.Stages.RemoveRange(stages);
        }

        public async Task UpdateStagesAsync(Vacancy vacancy, IEnumerable<string> stageNames, CancellationToken ct)
        {
            var normalized = stageNames.Select(x => x.Trim()).ToList();

            _context.Stages.RemoveRange(vacancy.Stages);

            vacancy.Stages.Clear();

            for (int i = 0; i < normalized.Count; i++)
            {
                vacancy.Stages.Add(new Stage
                {
                    Id = Guid.NewGuid(),
                    VacancyId = vacancy.Id,
                    Name = normalized[i],
                    Order = i + 1,
                    IsFinal = false
                });
            }
        }

        public async Task<Stage?> GetStageByOrderAsync(Guid vacancyId, int order, CancellationToken ct)
        {
            return await _context.Stages
                .FirstOrDefaultAsync(s => s.VacancyId == vacancyId && s.Order == order, ct);
        }
    }
}
