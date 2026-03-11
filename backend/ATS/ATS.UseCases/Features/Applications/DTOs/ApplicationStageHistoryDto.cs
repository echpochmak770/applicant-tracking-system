using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Applications.DTOs
{
    public class ApplicationStageHistoryDto
    {
        public Guid Id { get; set; }
        public string? FromStageName { get; set; }
        public string ToStageName { get; set; }
        public int Order { get; set; }
        public DateTime ChangedAt { get; set; }
        public string? Comment { get; set; }
        public string ChangedByName { get; set; }
        public bool IsRejection { get; set; }
    }
}
