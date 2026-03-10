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
        private readonly IApplicationRepository _repository;
        private readonly string _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "resumes");

        public GetResumeHandler(IApplicationRepository repository) => _repository = repository;

        public async Task<FileResponseDto> Handle(
            GetResumeQuery request,
            CancellationToken ct)
        {
            var application = await _repository.GetByIdAsync(
                request.ApplicationId,
                a => a.Resume
            );

            if (application == null || application.Resume == null || string.IsNullOrEmpty(application.Resume.FileName))
            {
                throw new Exception("File not found in the database");
            }

            var filePath = Path.Combine(_uploadPath, application.Resume.FileName);

            if (!File.Exists(filePath))
            {
                throw new Exception("File not found in server folder: " + filePath);
            }

            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
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
