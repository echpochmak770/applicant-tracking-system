using ATS.Domain.Entities;

namespace ATS.Domain.Interfaces
{
    public interface IApplicationHistoryRepository : IRepository<ApplicationHistory>
    {
        Task<List<ApplicationHistory>> GetByApplicationAsync(Guid vacancyId, Guid applicationId, CancellationToken ct);
    }
}
