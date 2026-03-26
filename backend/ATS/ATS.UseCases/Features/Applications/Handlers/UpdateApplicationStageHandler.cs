using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Applications.Commands;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Applications.Handlers
{
    public class UpdateApplicationStageHandler : IRequestHandler<UpdateApplicationStageCommand, Unit>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;

        public UpdateApplicationStageHandler(
            IApplicationRepository applicationRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService)
        {
            _applicationRepository = applicationRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(UpdateApplicationStageCommand request, CancellationToken ct)
        {
            var application = await _applicationRepository.GetWithDetailsAsync(request.ApplicationId)
                ?? throw new Exception("Application not found");

            var oldStageId = application.CurrentStageId;
            application.CurrentStageId = request.TargetStageId;

            application.Histories.Add(new ApplicationHistory
            {
                Id = Guid.NewGuid(),
                ApplicationId = application.Id,
                FromStageId = oldStageId,
                ToStageId = request.TargetStageId,
                Comment = request.Comment,
                IsRejection = request.IsRejection,
                ChangedAt = DateTime.UtcNow,
                ChangedById = _currentUserService.RequiredUserId
            });

            await _unitOfWork.SaveChangesAsync(ct);

            return Unit.Value;
        }
    }
}
