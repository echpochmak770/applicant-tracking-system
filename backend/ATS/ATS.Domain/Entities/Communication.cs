using ATS.Domain.Common;
using ATS.Domain.Enums;

namespace ATS.Domain.Entities
{
    public class Communication : BaseEntity
    {
        public CommunicationType Type { get; set; }
        public string Content { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public DateTime? OccurredAt { get; set; }

        public Guid ApplicationId { get; set; }
        public Guid CreatedById { get; set; }

        public Application Application { get; set; }
        public User CreatedBy { get; set; }
    }
}
