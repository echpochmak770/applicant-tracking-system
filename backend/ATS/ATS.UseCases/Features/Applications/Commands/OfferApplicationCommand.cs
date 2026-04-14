using MediatR;
using System.Text.Json.Serialization;

namespace ATS.UseCases.Features.Applications.Commands
{
    public class OfferApplicationCommand : IRequest<Unit>
    {
        [JsonIgnore]
        public Guid ApplicationId { get; set; }
        public string? Comment { get; set; }
    }
}