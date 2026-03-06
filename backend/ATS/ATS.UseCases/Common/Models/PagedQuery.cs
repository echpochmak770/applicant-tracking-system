using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Common.Models
{
    public class PagedQuery
    {
        public string? Search { get; set; }

        public string? SortBy { get; set; } = "CreatedAt";
        public string? SortDirection { get; set; } = "desc";

        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
