using ATS.UseCases.Features.Vacancies.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Vacancies.Queries
{
    public class GetVacancyByIdQuery : IRequest<VacancyDto>
    {
        public Guid VacancyId { get; set; }
    }
}
