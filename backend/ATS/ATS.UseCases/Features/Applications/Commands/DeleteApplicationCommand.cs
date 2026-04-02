using MediatR;

namespace ATS.UseCases.Features.Applications.Commands
{
    public class DeleteApplicationCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }
}
