using ATS.UseCases.Features.Resumes.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Resumes.Queries
{
    public class GetResumeQuery : IRequest<FileResponseDto>
    {
        public Guid ApplicationId { get; set; }
    }
}
