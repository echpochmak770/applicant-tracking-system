namespace ATS.WebApi.Requests
{
    public class CreateApplicationRequest
    {
        public Guid VacancyId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public IFormFile ResumeFile { get; set; }
    }
}
