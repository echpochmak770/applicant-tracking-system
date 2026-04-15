using MediatR;

namespace ATS.UseCases.Features.Applications.Commands
{
    public class CreateApplicationCommand : IRequest<Guid>
    {
        public Guid VacancyId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string ResumeFileName { get; set; }
        public Stream ResumeStream { get; set; }
    }
}
