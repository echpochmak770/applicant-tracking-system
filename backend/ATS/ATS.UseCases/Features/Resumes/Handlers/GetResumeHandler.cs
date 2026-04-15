using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Resumes.DTOs;
using ATS.UseCases.Features.Resumes.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Resumes.Handlers
{
    public class GetResumeHandler : IRequestHandler<GetResumeQuery, FileResponseDto>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IFileService _fileService;

        public GetResumeHandler(IApplicationRepository repository, IFileService fileService)
        {
            _applicationRepository = repository;
            _fileService = fileService;
        }

        public async Task<FileResponseDto> Handle(GetResumeQuery request, CancellationToken ct)
        {
            var application = await _applicationRepository.GetByIdAsync(
                request.ApplicationId,
                ct,
                a => a.Resume 
            );

            if (application?.Resume == null || string.IsNullOrEmpty(application.Resume.FileUrl))
            {
                throw new Exception("Резюме не найдено в базе данных для данного отклика.");
            }

            var fullPath = _fileService.GetFullPath(application.Resume.FileUrl);

            if (!File.Exists(fullPath))
            {
                throw new Exception($"Файл физически отсутствует по пути: {fullPath}");
            }

            var memory = new MemoryStream();
            using (var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read))
            {
                await stream.CopyToAsync(memory, ct);
            }
            memory.Position = 0;

            return new FileResponseDto
            {
                Content = memory,
                FileName = application.Resume.FileName,
                ContentType = "application/pdf"
            };
        }
    }
}
