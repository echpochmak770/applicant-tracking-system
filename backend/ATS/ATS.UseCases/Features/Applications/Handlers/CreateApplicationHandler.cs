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
        private readonly ICurrentUserService _currentUserService;
        private readonly IFileService _fileService;

        public CreateApplicationHandler(
            IUnitOfWork unitOfWork,
            IApplicationRepository applicationRepository,
            IStageRepository stageRepository,
            ICandidateRepository candidateRepository,
            ICurrentUserService currentUserService,
            IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _applicationRepository = applicationRepository;
            _stageRepository = stageRepository;
            _candidateRepository = candidateRepository;
            _currentUserService = currentUserService;
            _fileService = fileService;
        }

        public async Task<Guid> Handle(CreateApplicationCommand request, CancellationToken ct)
        {
            var firstStage = await GetFirstStageAsync(request.VacancyId);
            var recruiterId = _currentUserService.UserId ?? throw new ArgumentNullException("Couldn't get current user");

            string filePath = await _fileService.SaveFileAsync(request.ResumeStream, request.ResumeFileName, "resumes");

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var candidate = await GetOrCreateCandidateAsync(request);

                var resume = CreateResumeObject(candidate, request, filePath);

                var application = CreateApplicationObject(request, candidate, resume, firstStage.Id, recruiterId);

                await _applicationRepository.AddAsync(application);

                await _unitOfWork.SaveChangesAsync(ct);
                await _unitOfWork.CommitTransactionAsync();

                return application.Id;
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                await _fileService.DeleteFileAsync(filePath);
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
            var candidate = await _candidateRepository.GetByEmailIncludingDeletedAsync(request.Email);

            if (candidate == null)
            {
                candidate = new Candidate
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    Phone = request.Phone
                };
                await _candidateRepository.AddAsync(candidate);
            }
            else if (candidate.IsDeleted)
            {
                candidate.IsDeleted = false;

                candidate.FirstName = request.FirstName;
                candidate.LastName = request.LastName;
                candidate.Phone = request.Phone;

                _candidateRepository.Update(candidate);
            }

            return candidate;
        }

        private Resume CreateResumeObject(Candidate candidate, CreateApplicationCommand request, string filePath)
        {
            return new Resume
            {
                Candidate = candidate,
                FileName = request.ResumeFileName,
                FileUrl = filePath,
                Type = FileType.PDF
            };
        }

        private Application CreateApplicationObject(
            CreateApplicationCommand request,
            Candidate candidate,
            Resume resume,
            Guid stageId,
            Guid userId)
        {
            return new Application
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
        }
    }
}