using ATS.Domain.Common;
using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Common.Models;
using ATS.UseCases.Helpers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace ATS.Infrastructure.Persistence
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(Guid id)
        {
            return await _dbSet.FirstOrDefaultAsync(e => e.Id == id);
        }

        public IQueryable<T> Query()
        {
            return _dbSet.AsQueryable();
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        protected async Task<(List<TEntity> Items, int TotalCount)> GetPagedDataAsync<TEntity>(
            IQueryable<TEntity> query,
            int page,
            int pageSize,
            CancellationToken ct)
        {
            var totalCount = await query.CountAsync(ct);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);

            return (items, totalCount);
        }

        protected IQueryable<TEntity> ApplyUniversalSorting<TEntity>(
        IQueryable<TEntity> query,
        string? sortBy,
        string? direction,
        string defaultField)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
            {
                return query.ApplySorting(new List<SortModel>
                {
                    new() { Field = defaultField, Direction = "desc" }
                });
            }

            var field = MapSortField(sortBy.ToLower());

            return query.ApplySorting(new List<SortModel>
            {
                new() { Field = field, Direction = direction ?? "asc" }
            });
        }

        protected virtual string MapSortField(string sortBy) => sortBy;
    }
}
