using ATS.Core.Common.Models;
using ATS.Core.Features.Vacancies.DTOs;
using MediatR;

namespace ATS.Core.Features.Vacancies.Queries
{
    public class GetAllVacanciesQuery : IRequest<PagedResult<VacancyDto>>
    {
        public string? Search { get; set; }

        public string? SortBy { get; set; } = "createdAt";
        public string? SortDirection { get; set; } = "desc";

        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
