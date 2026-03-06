using ATS.UseCases.Common.Models;
using ATS.UseCases.Features.Vacancies.DTOs;
using ATS.UseCases.Features.Vacancies.Queries;
using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using MediatR;
using System.ComponentModel;
using System.Linq.Expressions;

namespace ATS.UseCases.Features.Vacancies.Handlers
{
    public class GetAllVacanciesHandler : IRequestHandler<GetAllVacanciesQuery, PagedResult<VacancyDto>>
    {
        private readonly IVacancyRepository _vacancyRepository;

        public GetAllVacanciesHandler(IVacancyRepository vacancyRepository)
        {
            _vacancyRepository = vacancyRepository;
        }

        public async Task<PagedResult<VacancyDto>> Handle(
            GetAllVacanciesQuery request,
            CancellationToken cancellationToken)
        {
            var (items, total) = await _vacancyRepository.GetAllPagedAsync(
                request.Search,
                request.SortBy,
                request.SortDirection,
                request.Page,
                request.PageSize,
                cancellationToken);

            var dtos = items.Select(v => new VacancyDto
            {
                Id = v.Id,
                Title = v.Title,
                Description = v.Description,
                Status = v.Status.ToString(),
                CreatedByName = v.CreatedBy.FirstName + " " + v.CreatedBy.LastName,
                CreatedAt = v.CreatedAt
            }).ToList();

            return new PagedResult<VacancyDto>
            {
                Items = dtos,
                TotalCount = total,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
    }
}
