using ATS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface IApplicationHistoryRepository : IRepository<ApplicationHistory>
    {
        Task<List<ApplicationHistory>> GetByApplicationAsync(Guid vacancyId, Guid applicationId, CancellationToken ct);
    }
}
