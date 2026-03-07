using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Common.Models;
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

            query = ApplyUniversalSorting(query, sortBy, sortDirection, "CreatedAt");

            return await GetPagedDataAsync(query, page, pageSize, ct);
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

        public async Task<Vacancy?> GetWithStagesAsync(Guid id)
        {
            return await _dbSet
                .Include(v => v.Stages)
                .FirstOrDefaultAsync(v => v.Id == id);
        }
    }
}
