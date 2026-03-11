using MediatR;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;
using System.Runtime.Serialization;
using Microsoft.AspNetCore.Mvc;

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
