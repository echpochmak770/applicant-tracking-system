using ATS.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace ATS.Domain.Entities
{
    public class User : BaseEntity
    {
        [EmailAddress]
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Phone]
        public string? Phone { get; set; }
        public UserRole Role { get; set; }

        public List<Vacancy> Vacancies { get; set; } = new List<Vacancy>();
        public List<ApplicationHistory> Changes { get; set; } = new List<ApplicationHistory>();
        public List<Communication> Communications { get; set; } = new List<Communication>();
    }
}
