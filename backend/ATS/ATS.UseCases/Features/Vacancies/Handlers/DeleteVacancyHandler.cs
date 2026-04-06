using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Vacancies.Commands;
using MediatR;

namespace ATS.UseCases.Features.Vacancies.Handlers
{
    public class DeleteVacancyHandler : IRequestHandler<DeleteVacancyCommand, Unit>
    {
        private readonly IVacancyRepository _vacancyRepository;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IStageRepository _stageRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteVacancyHandler(
            IVacancyRepository vacancyRepository,
            IApplicationRepository applicationRepository,
            IUnitOfWork unitOfWork)
        {
            _vacancyRepository = vacancyRepository;
            _applicationRepository = applicationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(DeleteVacancyCommand request, CancellationToken ct)
        {
            var vacancy = await _vacancyRepository.GetByIdAsync(request.Id)
                ?? throw new KeyNotFoundException($"Vacancy {request.Id} not found");

            var activeApplications = await _applicationRepository.GetByVacancyAsync(request.Id);
            if (activeApplications.Any())
            {
                throw new InvalidOperationException("Cannot delete vacancy with active applications.");
            }

            foreach (var stage in vacancy.Stages)
            {
                _stageRepository.Delete(stage);
            }

            _vacancyRepository.Delete(vacancy);

            await _unitOfWork.SaveChangesAsync(ct);
            return Unit.Value;
        }
    }
}