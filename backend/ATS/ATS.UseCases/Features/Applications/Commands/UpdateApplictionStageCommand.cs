using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Applications.Commands
{
    public class UpdateApplicationStageCommand : IRequest<Unit>
    {
        public Guid ApplicationId { get; set; }
        public Guid TargetStageId { get; set; }
        public string? Comment { get; set; }
        public bool IsRejection { get; set; }
    }
}
