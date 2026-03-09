using ATS.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ATS.Infrastructure.Persistence
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _dbSet.AnyAsync(x => x.Email == email);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
