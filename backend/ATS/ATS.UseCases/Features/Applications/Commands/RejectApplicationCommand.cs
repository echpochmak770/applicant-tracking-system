using MediatR;

namespace ATS.UseCases.Features.Applications.Commands
{
    public class RejectApplicationCommand : IRequest<Unit>
    {
        public Guid ApplicationId { get; set; }
        public string? Comment { get; set; }
    }
}
