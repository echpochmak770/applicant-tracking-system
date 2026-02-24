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
    }
}
