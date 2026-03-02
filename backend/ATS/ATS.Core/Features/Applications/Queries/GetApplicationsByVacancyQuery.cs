using ATS.Core.Common.Models;
using ATS.Core.Features.Applications.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Core.Features.Applications.Queries
{
    public class GetApplicationsByVacancyQuery : PagedQuery, IRequest<PagedResult<ApplicationDto>>
    {
        public Guid VacancyId { get; set; }
    }
}
