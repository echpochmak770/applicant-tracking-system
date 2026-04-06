using Microsoft.AspNetCore.Http;

namespace ATS.WebApi.Requests
{
    public class CreateApplicationDto
    {
        public Guid VacancyId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public IFormFile ResumeFile { get; set; } = null!;
    }
}