using ATS.Domain.Entities;

namespace ATS.Domain.Interfaces
{
    public interface ICandidateRepository : IRepository<Candidate>
    {
        Task<Candidate?> GetWithApplicationsAsync(Guid id);
        Task<Candidate?> GetByEmailAsync(string email);
        Task<Candidate?> GetByEmailIncludingDeletedAsync(string email);
    }
}
