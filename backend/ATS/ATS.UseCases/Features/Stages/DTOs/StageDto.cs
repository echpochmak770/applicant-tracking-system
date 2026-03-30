using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Stages.DTOs
{
    public class StageDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
