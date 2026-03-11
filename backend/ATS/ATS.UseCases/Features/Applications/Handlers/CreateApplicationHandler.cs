using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Applications.Commands;
using ATS.Domain.Enums;
using System.Linq;
using MediatR;

namespace ATS.UseCases.Features.Applications.Handlers
{
    public class CreateApplicationHandler : IRequestHandler<CreateApplicationCommand, Guid>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IStageRepository _stageRepository;
        private readonly ICandidateRepository _candidateRepository;
        private readonly IRepository<Resume> _resumeRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IFileService _fileService;

        private static readonly Guid SystemUserId = Guid.Parse("00000000-0000-0000-0000-000000000001");

        public CreateApplicationHandler(
            IUnitOfWork unitOfWork,
            IApplicationRepository applicationRepository,
            IStageRepository stageRepository,
            ICandidateRepository candidateRepository,
            IRepository<Resume> resumeRepository,
            ICurrentUserService currentUserService,
            IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _applicationRepository = applicationRepository;
            _stageRepository = stageRepository;
            _candidateRepository = candidateRepository;
            _resumeRepository = resumeRepository;
            _currentUserService = currentUserService;
            _fileService = fileService;
        }

        public async Task<Guid> Handle(CreateApplicationCommand request, CancellationToken ct)
        {
            var firstStage = await GetFirstStageAsync(request.VacancyId);

            var recruiterId = _currentUserService.RequiredUserId;

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var candidate = await GetOrCreateCandidateAsync(request);
                var resume = await CreateResumeAsync(candidate, request);

                var application = await CreateApplicationInternalAsync(request, candidate, resume, firstStage.Id, recruiterId);

                await _unitOfWork.SaveChangesAsync(ct);
                await _unitOfWork.CommitTransactionAsync();

                return application.Id;
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        private async Task<Stage> GetFirstStageAsync(Guid vacancyId)
        {
            var stages = await _stageRepository.GetByVacancyOrderedAsync(vacancyId);
            return stages.FirstOrDefault()
                ?? throw new InvalidOperationException("У вакансии не настроены этапы подбора.");
        }

        private async Task<Candidate> GetOrCreateCandidateAsync(CreateApplicationCommand request)
        {
            var candidate = await _candidateRepository.GetByEmailAsync(request.Email);

            if (candidate == null)
            {
                candidate = new Candidate
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    Phone = request.Phone ?? null
                };
                await _candidateRepository.AddAsync(candidate);
            }

            return candidate;
        }

        private async Task<Resume> CreateResumeAsync(Candidate candidate, CreateApplicationCommand request)
        {
            var filePath = await _fileService.SaveFileAsync(request.ResumeStream, request.ResumeFileName, "resumes");

            var resume = new Resume
            {
                Candidate = candidate,
                FileName = request.ResumeFileName,
                FileUrl = filePath,
                Type = FileType.PDF
            };

            await _resumeRepository.AddAsync(resume);
            return resume;
        }

        private async Task<Application> CreateApplicationInternalAsync(
            CreateApplicationCommand request,
            Candidate candidate,
            Resume resume,
            Guid stageId,
            Guid userId)
        {
            var application = new Application
            {
                VacancyId = request.VacancyId,
                Candidate = candidate,
                Resume = resume,
                CurrentStageId = stageId,
                CreatedById = userId,

                Histories = new List<ApplicationHistory>
                {
                    new ApplicationHistory
                    {
                        ToStageId = stageId,
                        ChangedById = userId,
                        ChangedAt = DateTime.UtcNow,
                        Comment = "Автоматическое создание отклика"
                    }
                }
            };

            await _applicationRepository.AddAsync(application);
            return application;
        }
    }
}