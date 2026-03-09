using ATS.UseCases.Features.Applications.Commands;
using ATS.UseCases.Features.Applications.DTOs;
using ATS.UseCases.Features.Applications.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ATS.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ApplicationsController(IMediator mediator) => _mediator = mediator;

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

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateApplicationCommand command, IFormFile resumeFile)
        {
            command.ResumeStream = resumeFile.OpenReadStream();
            command.ResumeFileName = resumeFile.FileName;

            var id = await _mediator.Send(command);

            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetApplicationByIdQuery { Id = id });
            return Ok(result);
        }

    }
}
