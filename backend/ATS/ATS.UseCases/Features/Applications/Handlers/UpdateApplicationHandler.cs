using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Applications.Commands;
using MediatR;
using ATS.Domain.Enums;

namespace ATS.UseCases.Features.Applications.Handlers
{
    public class UpdateApplicationHandler : IRequestHandler<UpdateApplicationCommand>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public UpdateApplicationHandler(
            IApplicationRepository applicationRepository,
            IUnitOfWork unitOfWork,
            IFileService fileService)
        {
            _applicationRepository = applicationRepository;
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task Handle(UpdateApplicationCommand request, CancellationToken ct)
        {
            var application = await _applicationRepository.GetForUpdateAsync(request.Id, ct)
                ?? throw new Exception("Application not found");

            string? oldFileUrl = null;
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                application.Candidate.FirstName = request.FirstName;
                application.Candidate.LastName = request.LastName;
                application.Candidate.Email = request.Email;
                application.Candidate.Phone = request.Phone;

                if (request.ResumeStream != null && !string.IsNullOrEmpty(request.ResumeFileName))
                {
                    var newFileUrl = await _fileService.SaveFileAsync(
                        request.ResumeStream,
                        request.ResumeFileName,
                        "resumes"
                    );

                    if (application.Resume != null)
                    {
                        oldFileUrl = application.Resume.FileUrl;

                        application.Resume.FileUrl = newFileUrl;
                        application.Resume.FileName = request.ResumeFileName;
                    }
                    else
                    {
                        application.Resume = new Resume
                        {
                            Candidate = application.Candidate,
                            FileUrl = newFileUrl,
                            FileName = request.ResumeFileName,
                            Type = FileType.PDF
                        };
                    }
                }

                _applicationRepository.Update(application);
                await _unitOfWork.SaveChangesAsync(ct);
                await _unitOfWork.CommitTransactionAsync();

                if (!string.IsNullOrEmpty(oldFileUrl))
                {
                    await _fileService.DeleteFileAsync(oldFileUrl);
                }
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }
    }
}