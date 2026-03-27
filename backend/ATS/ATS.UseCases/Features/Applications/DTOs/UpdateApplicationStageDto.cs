using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Applications.Commands
{
    public class UpdateApplicationStageDto
    {
        public Guid TargetStageId { get; set; }
        public string? Comment { get; set; }
    }
}
