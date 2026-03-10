using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Applications.DTOs;
using ATS.UseCases.Features.Applications.Queries;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Applications.Handlers
{
    internal class GetApplicationByIdHandler : IRequestHandler<GetApplicationByIdQuery, ApplicationDto>
    {
        private readonly IApplicationRepository _applicationRepository;

        public GetApplicationByIdHandler(IApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
        }

        public async Task<ApplicationDto> Handle(
            GetApplicationByIdQuery request,
            CancellationToken cancellationToken)
        {
            var a = await _applicationRepository.GetWithDetailsAsync(request.Id);

            if (a == null)
            {
                throw new KeyNotFoundException($"Отклик с ID {request.Id} не найден.");
            }

            return new ApplicationDto
            {
                Id = a.Id,
                CandidateFullName = $"{a.Candidate.FirstName} {a.Candidate.LastName}",
                Email = a.Candidate.Email,
                Phone = a.Candidate.Phone,
                CurrentStageName = a.CurrentStage.Name,
                CreatorFullName = $"{a.CreatedBy.FirstName} {a.CreatedBy.LastName}",
                ResumeFileUrl = a.Resume.FileUrl,
                ResumeName = a.Resume.FileName,
                IsDeleted = a.IsDeleted
            };
        }
    }
}
