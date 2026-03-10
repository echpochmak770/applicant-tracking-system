using ATS.Domain.Common;
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
        Task<(List<Application> Items, int Total)> GetByVacancyPagedAsync(
            Guid vacancyId,
            PagedQuery request,
            CancellationToken ct);

        Task<(List<ApplicationHistory> Items, int Total)> GetStageHistoryPagedAsync(
            Guid vacancyId,
            Guid applicationId,
            PagedQuery request,
            CancellationToken ct);
    }
}
