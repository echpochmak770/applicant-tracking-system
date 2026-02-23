using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Entities;

namespace ATS.Domain.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}
