using ATS.Core.Features.Vacancies.Handlers;
using ATS.Core.Features.Vacancies.Queries;
using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.VisualStudio.TestPlatform.Utilities;
using Moq;
using Xunit.Abstractions;

public class GetAllVacanciesHandlerTests
{
    private readonly Mock<IVacancyRepository> _repositoryMock;
    private readonly GetAllVacanciesHandler _handler;
    private readonly ITestOutputHelper _output;

    public GetAllVacanciesHandlerTests(ITestOutputHelper output)
    {
        _output = output;
        _repositoryMock = new Mock<IVacancyRepository>();
        _handler = new GetAllVacanciesHandler(_repositoryMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldReturnVacancies_WhenVacanciesExist()
    {
        var vacancies = new List<Vacancy>
    {
        new Vacancy
        {
            Id = Guid.NewGuid(),
            Title = "C# Developer",
            Description = "Strong Senior Developer",
            Status = ATS.Domain.Enums.VacancyStatus.Open,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = new User { FirstName = "John", LastName = "Doe" }
        },
        new Vacancy
        {
            Id = Guid.NewGuid(),
            Title = "QA Engineer",
            Description = "Automation expert",
            Status = ATS.Domain.Enums.VacancyStatus.Draft,
            CreatedAt = DateTime.UtcNow.AddDays(-1),
            CreatedBy = new User { FirstName = "Jane", LastName = "Smith" }
        }
    };

        _repositoryMock
            .Setup(r => r.GetAllPagedAsync(
                It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
                It.IsAny<int>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((vacancies, vacancies.Count));

        var query = new GetAllVacanciesQuery { Page = 1, PageSize = 10 };

        var result = await _handler.Handle(query, CancellationToken.None);

        foreach (var item in result.Items)
        {
            _output.WriteLine($"Vacancy: {item.Title}, Status: {item.Status}, CreatedBy: {item.CreatedByName}");
        }

        Assert.NotNull(result);
        Assert.Equal(2, result.TotalCount);
        Assert.Equal(2, result.Items.Count);

        var firstDto = result.Items[0];
        Assert.Equal("C# Developer", firstDto.Title);
        Assert.Equal("Open", firstDto.Status);
        Assert.Equal("John Doe", firstDto.CreatedByName);
    }

    
}