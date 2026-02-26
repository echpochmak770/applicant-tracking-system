using ATS.Core.Features.Vacancies.DTOs;
using ATS.Core.Features.Vacancies.Queries;
using ATS.Domain.Interfaces;
using MediatR;

namespace ATS.Core.Features.Vacancies.Handlers
{
    public class GetAllVacanciesHandler : IRequestHandler<GetAllVacanciesQuery, List<VacancyDto>>
    {
        private readonly IVacancyRepository _vacancyRepository;

        public GetAllVacanciesHandler(IVacancyRepository vacancyRepository)
        {
            _vacancyRepository = vacancyRepository;
        }

        public async Task<List<VacancyDto>> Handle(
            GetAllVacanciesQuery request,
            CancellationToken cancellationToken)
        {
            var vacancies = await _vacancyRepository.GetAllAsync();

            return vacancies.Select(v => new VacancyDto
            {
                Id = v.Id,
                Title = v.Title,
                Description = v.Description,
                Status = v.Status.ToString(),
                CreatedByName = v.CreatedBy.FirstName + " " + v.CreatedBy.LastName,
                CreatedAt = v.CreatedAt
            }).ToList();
        }
    }
}
