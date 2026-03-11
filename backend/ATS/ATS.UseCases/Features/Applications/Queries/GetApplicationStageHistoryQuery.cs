using ATS.Domain.Common;
using ATS.UseCases.Features.Applications.DTOs;
using ATS.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ATS.UseCases.Features.Applications.Queries
{
    public class GetApplicationStageHistoryQuery : IRequest<List<ApplicationStageHistoryDto>>
    {
        public Guid VacancyId { get; set; }
        public Guid ApplicationId { get; set; }
    }
}
