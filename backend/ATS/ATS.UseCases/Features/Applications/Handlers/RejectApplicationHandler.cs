using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Applications.Commands;
using MediatR;

namespace ATS.UseCases.Features.Applications.Handlers
{
    public class RejectApplicationHandler : IRequestHandler<RejectApplicationCommand, Unit>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IApplicationHistoryRepository _applicationHistoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;

        public RejectApplicationHandler(
            IApplicationRepository applicationRepository,
            IApplicationHistoryRepository applicationHistoryRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService)
        {
            _applicationRepository = applicationRepository;
            _applicationHistoryRepository = applicationHistoryRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(RejectApplicationCommand request, CancellationToken ct)
        {
            var application = await _applicationRepository.GetWithDetailsAsync(request.ApplicationId)
                ?? throw new Exception("Application not found");

            application.RejectionReason = request.Comment;

            var history = new ApplicationHistory
            {
                Id = Guid.NewGuid(),
                ApplicationId = application.Id,
                FromStageId = application.CurrentStageId,
                ToStageId = application.CurrentStageId,
                Comment = request.Comment,
                IsRejection = true,
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
