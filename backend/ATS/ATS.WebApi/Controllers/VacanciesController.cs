using ATS.Core.Features.Applications.Queries;
using ATS.Core.Features.Vacancies.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ATS.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VacanciesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public VacanciesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPaged([FromQuery] GetAllVacanciesQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{vacancyId}/applications")]
        public async Task<IActionResult> GetApplications(
            [FromRoute] Guid vacancyId,
            [FromQuery] GetApplicationsByVacancyQuery query)
        {
            if (vacancyId == Guid.Empty)
            {
                return BadRequest("Empty vacancy id");
            }

            query.VacancyId = vacancyId;

            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
