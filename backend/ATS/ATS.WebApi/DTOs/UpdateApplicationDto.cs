using Microsoft.AspNetCore.Http;

namespace ATS.WebApi.DTOs
{
    public class UpdateApplicationDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public IFormFile? ResumeFile { get; set; }
    }
}