using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Applications.Commands;
using MediatR;

namespace ATS.UseCases.Features.Applications.Handlers
{
    public class DeleteApplicationHandler : IRequestHandler<DeleteApplicationCommand, Unit>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IApplicationHistoryRepository _applicationHistoryRepository;
        private readonly IResumeRepository _resumeRepository;
        private readonly ICandidateRepository _candidateRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public DeleteApplicationHandler(
            IApplicationRepository applicationRepository,
            IApplicationHistoryRepository applicationHistoryRepository,
            IResumeRepository resumeRepository,
            ICandidateRepository candidateRepository,
            IUnitOfWork unitOfWork,
            IFileService fileService)
        {
            _applicationRepository = applicationRepository;
            _applicationHistoryRepository = applicationHistoryRepository;
            _resumeRepository = resumeRepository;
            _candidateRepository = candidateRepository;
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<Unit> Handle(DeleteApplicationCommand request, CancellationToken ct)
        {
            var application = await _applicationRepository.GetWithDetailsAsync(request.Id)
                ?? throw new KeyNotFoundException($"Application {request.Id} not found");

            if (application.Histories != null)
            {
                foreach (var history in application.Histories.ToList())
                {
                    _applicationHistoryRepository.Delete(history);
                }
            }

            if (application.Resume != null)
            {
                if (!string.IsNullOrEmpty(application.Resume.FileUrl))
                {
                    await _fileService.DeleteFileAsync(application.Resume.FileUrl);
                }

                _resumeRepository.Delete(application.Resume);
            }

            if (application.Candidate != null)
            {
                var otherApplications = await _applicationRepository.GetByCandidateAsync(application.Candidate.Id);

                if (!otherApplications.Any(a => a.Id != application.Id))
                {
                    _candidateRepository.Delete(application.Candidate);
                }
            }

            _applicationRepository.Delete(application);

            await _unitOfWork.SaveChangesAsync(ct);

            return Unit.Value;
        }
    }
}