using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Stages.DTOs;
using ATS.UseCases.Features.Stages.Queries;
using MediatR;

namespace ATS.UseCases.Features.Stages.Handlers
{
    public class GetStagesByVacancyHandler : IRequestHandler<GetStagesByVacancyQuery, List<StageDto>>
    {
        private readonly IStageRepository _stageRepository;

        public GetStagesByVacancyHandler(IStageRepository stageRepository)
        {
            _stageRepository = stageRepository;
        }

        public async Task<List<StageDto>> Handle(GetStagesByVacancyQuery request, CancellationToken cancellationToken)
        {
            var stages = await _stageRepository.GetByVacancyOrderedAsync(request.VacancyId);

            return stages
                .Where(s => s.Name != "Отказ")
                .Select(s => new StageDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Order = s.Order
                }).ToList();
        }
    }
}