using ATS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface IApplicationRepository : IRepository<Application>
    {
        Task<Application?> GetWithDetailsAsync(Guid id);
        Task<List<Application>> GetByVacancyAsync(Guid vacancyId);
        Task<List<Application>> GetByCandidateAsync(Guid candidateId);
        Task<(List<Application> Items, int TotalCount)> GetByVacancyPagedAsync(
        Guid vacancyId,
        string? search,
        string? sortBy,
        string? sortDirection,
        int page,
        int pageSize,
        CancellationToken ct);

        Task<(List<ApplicationHistory> Items, int TotalCount)> GetStageHistoryPagedAsync(
            Guid vacancyId,
            Guid applicationId,
            string? sortBy,
            string? sortDirection,
            int page,
            int pageSize,
            CancellationToken ct);
    }
}
