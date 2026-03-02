using ATS.Core.Common.Models;
using ATS.Core.Features.Vacancies.DTOs;
using MediatR;

namespace ATS.Core.Features.Vacancies.Queries
{
    public class GetAllVacanciesQuery : PagedQuery, IRequest<PagedResult<VacancyDto>>
    {
    }
}
