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
    }
}
