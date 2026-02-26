using ATS.Core.Features.Vacancies.Queries;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Core.Features.Vacancies.Validators
{
    public class GetAllVacanciesValidator : AbstractValidator<GetAllVacanciesQuery>
    {
        public GetAllVacanciesValidator()
        {
            RuleFor(x => x.Page)
                .GreaterThan(0);

            RuleFor(x => x.PageSize)
                .InclusiveBetween(1, 100);
        }
    }
}
