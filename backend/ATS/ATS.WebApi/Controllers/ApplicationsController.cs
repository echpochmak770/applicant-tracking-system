using ATS.Core.Features.Applications.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ATS.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ApplicationsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{vacancyId}/{applicationId}/history")]
        public async Task<IActionResult> GetHistory(
            Guid vacancyId,
            Guid applicationId,
            [FromQuery] GetApplicationStageHistoryQuery query)
        {
            query.VacancyId = vacancyId;
            query.ApplicationId = applicationId;

            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
