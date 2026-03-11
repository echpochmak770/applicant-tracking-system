using ATS.Domain.Common;
using ATS.UseCases.Features.Applications.DTOs;
using MediatR;
using System.Text.Json.Serialization;

public class GetApplicationsByVacancyQuery : PagedQuery, IRequest<PagedResult<ApplicationDto>>
{
    [JsonIgnore]
    public Guid VacancyId { get; set; }
}