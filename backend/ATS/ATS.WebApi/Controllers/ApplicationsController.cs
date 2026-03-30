using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Applications.Commands;
using ATS.UseCases.Features.Applications.Queries;
using ATS.UseCases.Features.Resumes.Queries;
using ATS.WebApi.Requests;
using ATS.WebApi.Requests.ATS.WebApi.Requests;
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
        private readonly IFileService _fileService;

        public ApplicationsController(IMediator mediator, IFileService fileService)
        {
            _mediator = mediator;
            _fileService = fileService;
        }

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

        [HttpGet("{applicationId}/resume")]
        public async Task<IActionResult> DownloadResume(Guid applicationId)
        {
            var result = await _mediator.Send(new GetResumeQuery { ApplicationId = applicationId });
            return File(result.Content, result.ContentType, result.FileName);
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(Guid id, [FromForm] UpdateApplicationRequest request)
        {
            string? uploadedUrl = null;
            string? uploadedName = null;

            if (request.ResumeFile != null)
            {
                uploadedName = request.ResumeFile.FileName;

                uploadedUrl = await _fileService.SaveFileAsync(
                    request.ResumeFile.OpenReadStream(),
                    uploadedName,
                    "resumes"
                );
            }

            await _mediator.Send(new UpdateApplicationCommand
            {
                Id = id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                ResumeFileUrl = uploadedUrl,
                ResumeFileName = uploadedName
            });

            return NoContent();
        }
    }
}
