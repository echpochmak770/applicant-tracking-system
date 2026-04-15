using MediatR;
using System.IO;

namespace ATS.UseCases.Features.Applications.Commands
{
    public class UpdateApplicationCommand : IRequest
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string? ResumeFileName { get; set; }
        public Stream? ResumeStream { get; set; }
    }
}