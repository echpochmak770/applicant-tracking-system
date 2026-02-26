using ATS.Core.Features.Vacancies.DTOs;
using MediatR;

namespace ATS.Core.Features.Vacancies.Queries
{
    public class GetAllVacanciesQuery : IRequest<List<VacancyDto>>
    {
    }
}
