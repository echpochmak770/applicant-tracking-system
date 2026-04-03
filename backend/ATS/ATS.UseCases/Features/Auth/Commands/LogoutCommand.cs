using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Auth.Commands
{
    public class LogoutCommand : IRequest
    {
        public string? RefreshToken { get; set; }
    }
}
