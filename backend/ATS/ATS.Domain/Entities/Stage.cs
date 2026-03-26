using ATS.Domain.Common;

namespace ATS.Domain.Entities
{
    public class Stage : BaseEntity
    {
        public string Name { get; set; }
        public int Order { get; set; }
        public bool IsFinal { get; set; }

        public Guid VacancyId { get; set; }

        public List<Application> Applications { get; set; } = new List<Application>();
        public Vacancy Vacancy { get; set; }
    }
}
