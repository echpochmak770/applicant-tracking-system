using System;
using System.Collections.Generic;
using System.Text;
using ATS.Core.Features.Auth.DTOs;
using FluentValidation;

namespace ATS.Core.Features.Auth.Validators
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(256);

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters")
                .MaximumLength(128);

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .MaximumLength(64);

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MaximumLength(64);

            RuleFor(x => x.Phone)
                .MaximumLength(20)
                .When(x => !string.IsNullOrEmpty(x.Phone));
        }
    }
}
