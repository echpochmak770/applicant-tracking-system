using ATS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface IStageRepository : IRepository<Stage>
    {
        Task<List<Stage>> GetByVacancyOrderedAsync(Guid vacancyId);
    }
}
