using ATS.UseCases.Features.Applications.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Applications.Queries
{
    public class GetApplicationByIdQuery() : IRequest<ApplicationDto>
    {
        public Guid Id { get; set; }
    }
}
