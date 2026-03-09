namespace ATS.Domain.Common
{
    public class PagedQuery
    {
        public string? Search { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public List<ColumnFilter> ColumnFilters { get; set; } = new();
    }
}

