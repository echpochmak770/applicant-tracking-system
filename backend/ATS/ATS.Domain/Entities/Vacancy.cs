using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Common;
using ATS.Domain.Enums;

namespace ATS.Domain.Entities
{
    public class Vacancy : BaseEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public VacancyStatus Status { get; set; }

        public Guid CreatedById { get; set; }

        public List<Application> Applications { get; set; } = new List<Application>();
        public User CreatedBy { get; set; }
        public ICollection<Stage> Stages { get; set; } = new List<Stage>();
    }
}
