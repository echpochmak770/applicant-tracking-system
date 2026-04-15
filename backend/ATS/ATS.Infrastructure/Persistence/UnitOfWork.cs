using ATS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using ATS.UseCases.Exceptions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace ATS.Infrastructure.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        {
            try
            {
                return await _context.SaveChangesAsync(ct);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new ConcurrencyException("Data was modified by another user");
            }
        }

        public async Task BeginTransactionAsync()
            => await _context.Database.BeginTransactionAsync();

        public async Task CommitTransactionAsync()
            => await _context.Database.CommitTransactionAsync();

        public async Task RollbackTransactionAsync()
            => await _context.Database.RollbackTransactionAsync();
    }
}
