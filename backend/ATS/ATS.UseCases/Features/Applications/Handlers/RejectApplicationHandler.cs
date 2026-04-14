using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Applications.Commands;
using MediatR;

namespace ATS.UseCases.Features.Applications.Handlers
{
    public class RejectApplicationHandler : IRequestHandler<RejectApplicationCommand>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IStageRepository _stageRepository;
        private readonly IApplicationHistoryRepository _applicationHistoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;

        public RejectApplicationHandler(
            IApplicationRepository applicationRepository,
            IStageRepository stageRepository,
            IApplicationHistoryRepository applicationHistoryRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService)
        {
            _applicationRepository = applicationRepository;
            _stageRepository = stageRepository;
            _applicationHistoryRepository = applicationHistoryRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        public async Task Handle(RejectApplicationCommand request, CancellationToken ct)
        {
            var application = await _applicationRepository.GetForUpdateAsync(request.ApplicationId, ct)
                ?? throw new Exception("Application not found");

            var stages = await _stageRepository.GetByVacancyOrderedAsync(application.VacancyId);
            var rejectionStage = stages.FirstOrDefault(s => s.Order == -1)
                ?? throw new InvalidOperationException("Технический этап 'Отказ' не найден для этой вакансии.");

            var recruiterId = _currentUserService.RequiredUserId;

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var previousStageId = application.CurrentStageId;

                application.CurrentStageId = rejectionStage.Id;
                application.RejectionReason = request.Comment;

                var history = new ApplicationHistory
                {
                    Id = Guid.CreateVersion7(),
                    ApplicationId = application.Id,
                    FromStageId = previousStageId,
                    ToStageId = rejectionStage.Id,
                    Comment = request.Comment,
                    IsRejection = true,
                    ChangedAt = DateTime.UtcNow,
                    ChangedById = recruiterId
                };

                _applicationRepository.Update(application);

                await _applicationHistoryRepository.AddAsync(history);

                await _unitOfWork.SaveChangesAsync(ct);
                await _unitOfWork.CommitTransactionAsync();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }
    }
}