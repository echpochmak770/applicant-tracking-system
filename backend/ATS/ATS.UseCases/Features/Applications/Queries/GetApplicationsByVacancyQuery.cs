using ATS.UseCases.Common.Models;
using ATS.UseCases.Features.Applications.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ATS.UseCases.Features.Applications.Queries
{
    public class GetApplicationsByVacancyQuery : PagedQuery, IRequest<PagedResult<ApplicationDto>>
    {
        [JsonIgnore]
        [BindNever]
        public Guid VacancyId { get; set; }
    }
}
