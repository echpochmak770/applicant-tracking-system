using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Common.Models
{
    public class ColumnFilter
    {
        public string Field { get; set; } = string.Empty;
        public string? Sort { get; set; }
        public string? Filter { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }
}
