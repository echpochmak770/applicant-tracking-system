using ATS.UseCases.Features.Applications.Commands;
using ATS.UseCases.Features.Applications.Queries;
using ATS.UseCases.Features.Resumes.Queries;
using ATS.WebApi.Requests;
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
        public async Task<IActionResult> GetHistory(Guid vacancyId, Guid applicationId)
        {
            var result = await _mediator.Send(new GetApplicationStageHistoryQuery
            {
                VacancyId = vacancyId,
                ApplicationId = applicationId
            });
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateApplicationRequest request)
        {
            var command = new CreateApplicationCommand
            {
                VacancyId = request.VacancyId,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                ResumeStream = request.ResumeFile.OpenReadStream(),
                ResumeFileName = request.ResumeFile.FileName
            };

            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetApplicationByIdQuery { Id = id });
            return Ok(result);
        }

        [HttpGet("{id}/resume")]
        public async Task<IActionResult> DownloadResume(Guid id)
        {
            var result = await _mediator.Send(new GetResumeQuery { ApplicationId = id });
            return File(result.Content, result.ContentType, result.FileName);
        }
    }
}
