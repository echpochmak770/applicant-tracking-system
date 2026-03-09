using ATS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface IResumeRepository : IRepository<Resume>
    {
        Task<List<Resume>> GetByCandidateAsync(Guid candidateId);
    }
}
