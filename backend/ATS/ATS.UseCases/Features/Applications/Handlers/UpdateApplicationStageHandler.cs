using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Applications.Commands;
using MediatR;

namespace ATS.UseCases.Features.Applications.Handlers
{
    public class UpdateApplicationStageHandler : IRequestHandler<UpdateApplicationStageCommand, Unit>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IApplicationHistoryRepository _applicationHistoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;

        public UpdateApplicationStageHandler(
            IApplicationRepository applicationRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService,
            IApplicationHistoryRepository applicationHistoryRepository
            )
        {
            _applicationRepository = applicationRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
            _applicationHistoryRepository = applicationHistoryRepository;
        }

        public async Task<Unit> Handle(UpdateApplicationStageCommand request, CancellationToken ct)
        {
            var application = await _applicationRepository.GetWithDetailsAsync(request.ApplicationId)
                ?? throw new Exception("Application not found");

            var oldStageId = application.CurrentStageId;

            if (!string.IsNullOrEmpty(application.RejectionReason))
            {
                application.RejectionReason = null;
            }

            application.CurrentStageId = request.TargetStageId;

            var history = new ApplicationHistory
            {
                Id = Guid.NewGuid(),
                ApplicationId = application.Id,
                FromStageId = oldStageId,
                ToStageId = request.TargetStageId,
                Comment = request.Comment ?? "Кандидат возвращен в работу",
                IsRejection = false,
                ChangedAt = DateTime.UtcNow,
                ChangedById = _currentUserService.RequiredUserId
            };

            _applicationRepository.Update(application);
            await _applicationHistoryRepository.AddAsync(history);

            await _unitOfWork.SaveChangesAsync(ct);

            return Unit.Value;
        }
    }
}
