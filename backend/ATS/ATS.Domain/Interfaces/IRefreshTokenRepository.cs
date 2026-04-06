using ATS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface IRefreshTokenRepository : IRepository<RefreshToken>
    {
        Task DeleteAllForUserAsync(Guid userId);
        Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default);
    }
}
