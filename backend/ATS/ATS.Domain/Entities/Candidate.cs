using ATS.Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ATS.Domain.Entities
{
    public class Candidate : BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [Phone]
        public string? Phone { get; set; }

        public List<Application> Applications { get; set; } = new List<Application>();
        public List<Resume> Resumes { get; set; } = new List<Resume>();
    }
}
