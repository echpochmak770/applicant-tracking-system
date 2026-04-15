using ATS.Domain.Common;
using ATS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface IVacancyRepository : IRepository<Vacancy>
    {
        Task<Vacancy?> GetWithStagesAsync(Guid id, CancellationToken ct);
        Task<Vacancy?> GetFullAsync(Guid id);
        Task<Vacancy?> GetWithAuthorByIdAsync(Guid id);
        Task<(List<Vacancy> Items, int Total)> GetAllPagedAsync(PagedQuery request, CancellationToken ct);
        Task RemoveStagesAsync(IEnumerable<Guid> stageIds, CancellationToken ct);
        Task UpdateStagesAsync(Vacancy vacancy, IEnumerable<string> stageNames, CancellationToken ct);
        Task<Stage?> GetStageByOrderAsync(Guid vacancyId, int order, CancellationToken ct);
    }
}
