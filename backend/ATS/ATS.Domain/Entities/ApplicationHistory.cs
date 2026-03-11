using ATS.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Entities
{
    public class ApplicationHistory : BaseEntity
    {
        public DateTime ChangedAt { get; set; }
        public string? Comment { get; set; }
        public bool IsRejection { get; set; }

        public Guid ApplicationId { get; set; }
        public Guid? FromStageId { get; set; }
        public Guid? ToStageId { get; set; }
        public Guid ChangedById { get; set; }

        public Application Application { get; set; }
        public Stage? FromStage { get; set; }
        public Stage? ToStage { get; set; }
        public User ChangedBy { get; set; }
    }
}
