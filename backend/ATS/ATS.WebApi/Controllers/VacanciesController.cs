using ATS.UseCases.Features.Stages.Queries;
using ATS.UseCases.Features.Vacancies.Commands;
using ATS.UseCases.Features.Vacancies.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ATS.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VacanciesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public VacanciesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("search")]
        public async Task<IActionResult> GetAllPaged([FromBody] GetAllVacanciesQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("{vacancyId}/applications/search")]
        public async Task<IActionResult> GetApplications(
            [FromRoute] Guid vacancyId,
            [FromBody] GetApplicationsByVacancyQuery query)
        {
            if (vacancyId == Guid.Empty) return BadRequest("Empty vacancy id");

            query.VacancyId = vacancyId;

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVacancyCommand command)
        {
            var id = await _mediator.Send(command);

            return CreatedAtAction(
                nameof(GetById),
                new { id = id },
                new { id, message = "Вакансия успешно создана" });
        }

        [HttpGet("{vacancyId}")]
        public async Task<IActionResult> GetById(Guid vacancyId)
        {   
            var result = await _mediator.Send(new GetVacancyByIdQuery { VacancyId = vacancyId });
            return Ok(result);
        }

        [HttpGet("{vacancyId}/stages")]
        public async Task<IActionResult> GetStages(Guid vacancyId)
        {
            var result = await _mediator.Send(new GetStagesByVacancyQuery { VacancyId = vacancyId });
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVacancyCommand command)
        {
            command.Id = id;
            await _mediator.Send(command);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteVacancyCommand { Id = id });
            return NoContent();
        }
    }
}
