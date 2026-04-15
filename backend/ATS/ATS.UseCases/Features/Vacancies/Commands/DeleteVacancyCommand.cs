using MediatR;

namespace ATS.UseCases.Features.Vacancies.Commands
{
    public class DeleteVacancyCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }
}