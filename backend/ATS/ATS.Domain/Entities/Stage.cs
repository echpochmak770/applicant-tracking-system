using ATS.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

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
