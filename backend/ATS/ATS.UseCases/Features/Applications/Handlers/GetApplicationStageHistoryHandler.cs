using ATS.Domain.Common;
using ATS.UseCases.Features.Applications.DTOs;
using ATS.UseCases.Features.Applications.Queries;
using ATS.Domain.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Applications.Handlers
{
    internal class GetApplicationStageHistoryHandler
        : IRequestHandler<GetApplicationStageHistoryQuery, PagedResult<ApplicationStageHistoryDto>>
    {
        private readonly IApplicationRepository _applicationRepository;

        public GetApplicationStageHistoryHandler(IApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
        }

        public async Task<PagedResult<ApplicationStageHistoryDto>> Handle(
            GetApplicationStageHistoryQuery request,
            CancellationToken ct)
        {
            var (items, total) = await _applicationRepository.GetStageHistoryPagedAsync(
                request.VacancyId,
                request.ApplicationId,
                request,
                ct);

            var dtos = items.Select(h => new ApplicationStageHistoryDto
            {
                Id = h.Id,
                FromStageName = h.FromStage?.Name,
                ToStageName = h.ToStage.Name,
                Order = h.ToStage.Order,
                ChangedAt = h.ChangedAt,
                Comment = h.Comment,
                ChangedByName = $"{h.ChangedBy.FirstName} {h.ChangedBy.LastName}"
            }).ToList();

            return new PagedResult<ApplicationStageHistoryDto>
            {
                Items = dtos,
                TotalCount = total,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
    }
}
