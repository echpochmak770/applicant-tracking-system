using ATS.Core.Features.Vacancies.Commands;
using ATS.Domain.Entities;
using ATS.Domain.Enums;
using ATS.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Core.Features.Vacancies.Handlers
{
    public class CreateVacancyHandler : IRequestHandler<CreateVacancyCommand, Guid>
    {
        private readonly IVacancyRepository _vacancyRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUnitOfWork _unitOfWork;

        public CreateVacancyHandler(
            IVacancyRepository vacancyRepository,
            ICurrentUserService currentUserService,
            IUnitOfWork unitOfWork)
        {
            _vacancyRepository = vacancyRepository;
            _currentUserService = currentUserService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateVacancyCommand request, CancellationToken ct)
        {
            var vacancy = new Vacancy
            {
                Id = Guid.CreateVersion7(),
                Title = request.Title,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
                CreatedById = _currentUserService.RequiredUserId,
                Status = VacancyStatus.Open,
                Stages = new List<Stage>()
            };

            for (int i = 0; i < request.StagesNames.Count; i++)
            {
                vacancy.Stages.Add(new Stage
                {
                    Id = Guid.NewGuid(),
                    Name = request.StagesNames[i],
                    Order = i + 1
                });
            }

            await _vacancyRepository.AddAsync(vacancy);
            await _unitOfWork.SaveChangesAsync(ct);

            return vacancy.Id;
        }
    }
}
