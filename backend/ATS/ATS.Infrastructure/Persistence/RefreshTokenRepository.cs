using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Infrastructure.Persistence
{
    public class RefreshTokenRepository : Repository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(AppDbContext dbContext) : base(dbContext) { }

        public async Task DeleteAllForUserAsync(Guid userId)
        {
            var tokens = await _dbSet.Where(t => t.UserId == userId).ToListAsync();
            foreach (var token in tokens) _dbSet.Remove(token);
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default)
        {
            return await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == token, ct);
        }
    }
}
