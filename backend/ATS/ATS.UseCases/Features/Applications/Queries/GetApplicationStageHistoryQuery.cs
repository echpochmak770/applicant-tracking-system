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
    public class GetApplicationStageHistoryQuery : PagedQuery, IRequest<PagedResult<ApplicationStageHistoryDto>>
    {
        [JsonIgnore]
        [BindNever]
        public Guid VacancyId { get; set; }
        [JsonIgnore]
        [BindNever]
        public Guid ApplicationId { get; set; }
    }
}
