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
    public class GetApplicationStageHistoryHandler
    : IRequestHandler<GetApplicationStageHistoryQuery, List<ApplicationStageHistoryDto>>
    {
        private readonly IApplicationHistoryRepository _historyRepository;

        public GetApplicationStageHistoryHandler(IApplicationHistoryRepository historyRepository)
        {
            _historyRepository = historyRepository;
        }

        public async Task<List<ApplicationStageHistoryDto>> Handle(
            GetApplicationStageHistoryQuery request,
            CancellationToken ct)
        {
            var history = await _historyRepository.GetByApplicationAsync(
                request.VacancyId,
                request.ApplicationId,
                ct);

            return history.Select(h => new ApplicationStageHistoryDto
            {
                Id = h.Id,
                FromStageName = h.FromStage?.Name ?? "Начало",
                ToStageName = h.ToStage?.Name,
                ChangedAt = h.ChangedAt,
                Comment = h.Comment,
                ChangedByName = $"{h.ChangedBy?.FirstName} {h.ChangedBy?.LastName}".Trim()
            }).ToList();
        }
    }
}
