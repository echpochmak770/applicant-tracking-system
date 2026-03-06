using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Vacancies.Commands
{
    public class CreateVacancyCommand : IRequest<Guid>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> StagesNames { get; set; } = new();
    }
}
