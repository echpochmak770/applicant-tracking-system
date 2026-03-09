using ATS.UseCases.Common.Models;

public class PagedQuery
{
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }

    public List<SortModel> Sorts { get; set; } = new();
}