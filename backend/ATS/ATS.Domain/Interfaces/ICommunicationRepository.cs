using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Entities;

namespace ATS.Domain.Interfaces
{
    public interface ICommunicationRepository : IRepository<Communication>
    {
        Task<List<Communication>> GetByApplicationAsync(Guid applicationId);
    }
}
