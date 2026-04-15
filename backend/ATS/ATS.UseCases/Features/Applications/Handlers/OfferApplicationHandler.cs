using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Applications.Commands;
using MediatR;

namespace ATS.UseCases.Features.Applications.Handlers
{
    public class OfferApplicationHandler : IRequestHandler<OfferApplicationCommand, Unit>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IVacancyRepository _vacancyRepository;
        private readonly IApplicationHistoryRepository _historyRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;

        public OfferApplicationHandler(
            IApplicationRepository applicationRepository,
            IVacancyRepository vacancyRepository,
            IApplicationHistoryRepository historyRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService)
        {
            _applicationRepository = applicationRepository;
            _vacancyRepository = vacancyRepository;
            _historyRepository = historyRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(OfferApplicationCommand request, CancellationToken ct)
        {
            var application = await _applicationRepository.GetWithDetailsAsync(request.ApplicationId)
                ?? throw new Exception("Application not found");

            var offerStage = await _vacancyRepository.GetStageByOrderAsync(
                application.VacancyId,
                int.MaxValue,
                ct) ?? throw new Exception("Offer stage not found");

            var oldStageId = application.CurrentStageId;

            application.CurrentStageId = offerStage.Id;

            if (!string.IsNullOrEmpty(application.RejectionReason))
            {
                application.RejectionReason = null;
            }

            var history = new ApplicationHistory
            {
                Id = Guid.NewGuid(),
                ApplicationId = application.Id,
                FromStageId = oldStageId,
                ToStageId = offerStage.Id,
                Comment = request.Comment ?? "Выставлен оффер",
                IsRejection = false,
                ChangedAt = DateTime.UtcNow,
                ChangedById = _currentUserService.RequiredUserId
            };

            _applicationRepository.Update(application);
            await _historyRepository.AddAsync(history);
            await _unitOfWork.SaveChangesAsync(ct);

            return Unit.Value;
        }
    }
}