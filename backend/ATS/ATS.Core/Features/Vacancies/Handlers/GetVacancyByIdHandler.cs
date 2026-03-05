using ATS.Core.Features.Vacancies.DTOs;
using ATS.Core.Features.Vacancies.Queries;
using ATS.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Core.Features.Vacancies.Handlers
{
    public class GetVacancyByIdHandler : IRequestHandler<GetVacancyByIdQuery, VacancyDto>
    {
        private readonly IVacancyRepository _vacancyRepository;

        public GetVacancyByIdHandler(IVacancyRepository vacancyRepository)
        {
            _vacancyRepository = vacancyRepository;
        }

        public async Task<VacancyDto> Handle(GetVacancyByIdQuery request, CancellationToken cancellationToken)
        {
            var vacancy = await _vacancyRepository.GetWithAuthorByIdAsync(request.Id);

            if (vacancy is null)
            {
                throw new KeyNotFoundException($"Vacancy with id {request.Id} was not found");
            }

            return new VacancyDto
            {
                Id = vacancy.Id,
                Title = vacancy.Title,
                Description = vacancy.Description,
                Status = vacancy.Status.ToString(),
                CreatedAt = vacancy.CreatedAt,
                CreatedByName = $"{vacancy.CreatedBy.FirstName} {vacancy.CreatedBy.LastName}"
            };
        }
    }
}
