using ATS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface ICandidateRepository : IRepository<Candidate>
    {
        Task<Candidate?> GetWithApplicationsAsync(Guid id);
        Task<Candidate?> GetByEmailAsync(string email);
    }
}
