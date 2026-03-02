using ATS.Core.Common.Models;
using ATS.Core.Features.Applications.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ATS.Core.Features.Applications.Queries
{
    public class GetApplicationsByVacancyQuery : PagedQuery, IRequest<PagedResult<ApplicationDto>>
    {
        [JsonIgnore]
        [BindNever]
        public Guid VacancyId { get; set; }
    }
}
