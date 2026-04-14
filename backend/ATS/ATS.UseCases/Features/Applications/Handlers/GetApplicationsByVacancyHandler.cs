using ATS.Domain.Common;
using ATS.UseCases.Features.Applications.DTOs;
using ATS.UseCases.Features.Applications.Queries;
using ATS.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace ATS.UseCases.Features.Applications.Handlers
{
    internal class GetApplicationsByVacancyHandler : IRequestHandler<GetApplicationsByVacancyQuery, PagedResult<ApplicationDto>>
    {
        private readonly IApplicationRepository _applicationRepository;

        public GetApplicationsByVacancyHandler(IApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
        }

        public async Task<PagedResult<ApplicationDto>> Handle(
            GetApplicationsByVacancyQuery request,
            CancellationToken cancellationToken)
        {
            var (items, total) = await _applicationRepository.GetByVacancyPagedAsync(
                request.VacancyId,
                request,
                cancellationToken);

            var dtos = items.Select(a => new ApplicationDto
            {
                Id = a.Id,
                CandidateFullName = $"{a.Candidate.FirstName} {a.Candidate.LastName}",
                Email = a.Candidate.Email,
                Phone = a.Candidate.Phone,
                CurrentStageName = a.CurrentStage.Name,
                CreatorFullName = $"{a.CreatedBy.FirstName} {a.CreatedBy.LastName}",
                ResumeFileUrl = a.Resume.FileUrl,
                ResumeName = a.Resume.FileName,
                IsDeleted = a.IsDeleted,
                IsRejected = !string.IsNullOrEmpty(a.RejectionReason)
            }).ToList();

            return new PagedResult<ApplicationDto>
            {
                Items = dtos,
                TotalCount = total,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
    }
}
