using ATS.Domain.Enums;
using MediatR;
using System.Text.Json.Serialization;

namespace ATS.UseCases.Features.Vacancies.Commands
{
    public class UpdateVacancyCommand : IRequest<Unit>
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public VacancyStatus Status { get; set; }
    }
}
