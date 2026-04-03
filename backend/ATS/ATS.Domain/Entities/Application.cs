using ATS.Domain.Common;

namespace ATS.Domain.Entities
{
    public class Application : BaseEntity
    {
        public string? RejectionReason { get; set; }

        public Guid? CandidateId { get; set; }
        public Guid VacancyId { get; set; }
        public Guid CurrentStageId { get; set; }
        public Guid? ResumeId { get; set; }
        public Guid CreatedById { get; set; }

        public List<ApplicationHistory> Histories { get; set; } = new List<ApplicationHistory>();
        public List<Communication> Communications { get; set; } = new List<Communication>();
        public Candidate? Candidate { get; set; }
        public Vacancy Vacancy { get; set; }
        public Stage CurrentStage { get; set; }
        public Resume? Resume { get; set; }
        public User CreatedBy { get; set; }
    }
}
