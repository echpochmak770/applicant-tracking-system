using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Applications.DTOs
{
    public class ApplicationDto
    {
        public Guid Id { get; set; }
        public string CandidateFullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string CurrentStageName { get; set; }
        public string CreatorFullName { get; set; }
        public string ResumeFileUrl { get; set; }
        public string ResumeName { get; set; }
        public bool IsDeleted { get; set; }
    }
}
