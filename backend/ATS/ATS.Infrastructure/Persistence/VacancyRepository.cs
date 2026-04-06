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

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(v => v.Title.Contains(request.Search) ||
                                         v.Description.Contains(request.Search));
            }

            query = query.ApplyDynamicQuery(request);

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
    }
}
