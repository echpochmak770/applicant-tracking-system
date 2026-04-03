using MediatR;
using ATS.UseCases.Features.Auth.DTOs;

namespace ATS.UseCases.Features.Auth.Commands
{
    public class RefreshTokenCommand : IRequest<AuthResponseDto>
    {
        public string? RefreshToken { get; set; }
    }
}