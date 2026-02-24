using ATS.Domain.Common;
using ATS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Entities
{
    public class Resume : BaseEntity
    {
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public FileType Type { get; set; }

        public Guid CandidateId { get; set; }

        public Candidate Candidate { get; set; }
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
