using System;
using System.Collections.Generic;
using System.Text;
using ATS.UseCases.Features.Stages.DTOs;
using MediatR;

namespace ATS.UseCases.Features.Stages.Queries
{
    public class GetStagesByVacancyQuery : IRequest<List<StageDto>>
    {
        public Guid VacancyId { get; set; }
    }
}
