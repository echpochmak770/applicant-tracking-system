using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Vacancies.Commands;
using MediatR;

namespace ATS.UseCases.Features.Vacancies.Handlers
{
    public class UpdateVacancyHandler : IRequestHandler<UpdateVacancyCommand, Unit>
    {
        private readonly IVacancyRepository _vacancyRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateVacancyHandler(
            IVacancyRepository vacancyRepository,
            IUnitOfWork unitOfWork)
        {
            _vacancyRepository = vacancyRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(UpdateVacancyCommand request, CancellationToken ct)
        {
            var vacancy = await _vacancyRepository.GetByIdAsync(request.Id, ct)
                ?? throw new InvalidOperationException("Vacancy not found");

            vacancy.Title = request.Title;
            vacancy.Description = request.Description;
            vacancy.Status = request.Status;

            _vacancyRepository.Update(vacancy);
            await _unitOfWork.SaveChangesAsync(ct);

            return Unit.Value;
        }
    }
}