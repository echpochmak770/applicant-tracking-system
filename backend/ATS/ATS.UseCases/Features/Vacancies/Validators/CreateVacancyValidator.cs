using System;
using System.Collections.Generic;
using System.Text;
using ATS.UseCases.Features.Vacancies.Commands;
using FluentValidation;

namespace ATS.UseCases.Features.Vacancies.Validators
{
    public class CreateVacancyValidator : AbstractValidator<CreateVacancyCommand>
    {
        public CreateVacancyValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .MaximumLength(512);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(2048);

            RuleFor(x => x.StagesNames)
                .NotEmpty()
                .Must(s => s.Count >= 2)
                .WithMessage("Минимум 2 стадии");

            RuleForEach(x => x.StagesNames)
                .NotEmpty()
                .MaximumLength(128);
        }
    }
}
