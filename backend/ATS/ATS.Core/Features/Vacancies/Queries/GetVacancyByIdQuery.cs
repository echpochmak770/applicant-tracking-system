using ATS.Core.Features.Vacancies.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Core.Features.Vacancies.Queries
{
    public class GetVacancyByIdQuery : IRequest<VacancyDto>
    {
        public Guid Id { get; set; }
    }
}
