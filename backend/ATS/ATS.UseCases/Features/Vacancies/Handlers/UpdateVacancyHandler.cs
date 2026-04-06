using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Vacancies.Commands;
using MediatR;

namespace ATS.UseCases.Features.Vacancies.Handlers
{
    public class UpdateVacancyHandler : IRequestHandler<UpdateVacancyCommand, Unit>
    {
        private readonly IVacancyRepository _vacancyRepository;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateVacancyHandler(
            IVacancyRepository vacancyRepository,
            IApplicationRepository applicationRepository,
            IUnitOfWork unitOfWork)
        {
            _vacancyRepository = vacancyRepository;
            _applicationRepository = applicationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(UpdateVacancyCommand request, CancellationToken ct)
        {
            var vacancy = await _vacancyRepository.GetWithStagesAsync(request.Id, ct)
                ?? throw new Exception("Vacancy not found");

            var reservedNames = new[] { "Отказ", "Оффер" };
            if (request.StagesNames.Any(name => reservedNames.Contains(name, StringComparer.OrdinalIgnoreCase)))
            {
                throw new InvalidOperationException("Названия 'Отказ' и 'Оффер' зарезервированы системой.");
            }

            var systemStages = vacancy.Stages
                .Where(s => s.Order == -1 || s.Order == int.MaxValue)
                .ToList();

            var oldUserStages = vacancy.Stages
                .Where(s => s.Order != -1 && s.Order != int.MaxValue)
                .ToList();

            var finalUserStages = new List<Stage>();

            for (int i = 0; i < request.StagesNames.Count; i++)
            {
                var name = request.StagesNames[i];
                var existing = oldUserStages.FirstOrDefault(s => s.Name == name);

                if (existing != null)
                {
                    existing.Order = i + 1;
                    finalUserStages.Add(existing);
                    oldUserStages.Remove(existing);
                }
                else
                {
                    finalUserStages.Add(new Stage
                    {
                        Id = Guid.NewGuid(),
                        VacancyId = vacancy.Id,
                        Name = name,
                        Order = i + 1
                    });
                }
            }

            if (oldUserStages.Any())
            {
                var stageIdsToDelete = oldUserStages.Select(s => s.Id).ToList();

                bool hasApplications = await _applicationRepository.AnyApplicationsOnStagesAsync(stageIdsToDelete, ct);

                if (hasApplications)
                {
                    throw new InvalidOperationException("Нельзя удалить этапы, на которых есть активные кандидаты.");
                }
            }

            vacancy.Title = request.Title;
            vacancy.Description = request.Description;
            vacancy.Status = request.Status;

            vacancy.Stages.Clear();
            foreach (var stage in systemStages.Concat(finalUserStages))
            {
                vacancy.Stages.Add(stage);
            }

            _vacancyRepository.Update(vacancy);
            await _unitOfWork.SaveChangesAsync(ct);

            return Unit.Value;
        }
    }
}
