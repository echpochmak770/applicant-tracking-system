using ATS.Core.Features.Auth.DTOs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Core.Features.Auth.Validators
{
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        public LoginDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("A valid email address is required");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required");
        }
    }
}
