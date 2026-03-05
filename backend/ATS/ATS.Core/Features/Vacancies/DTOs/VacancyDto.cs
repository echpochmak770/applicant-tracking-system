using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Core.Features.Vacancies.DTOs
{
    public record VacancyDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string CreatedByName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
