using ATS.UseCases.Common.Models;
using ATS.UseCases.Features.Vacancies.DTOs;
using MediatR;

namespace ATS.UseCases.Features.Vacancies.Queries
{
    public class GetAllVacanciesQuery : PagedQuery, IRequest<PagedResult<VacancyDto>>
    {
    }
}
