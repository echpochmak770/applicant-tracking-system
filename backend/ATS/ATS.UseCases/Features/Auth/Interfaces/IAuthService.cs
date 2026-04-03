using ATS.Domain.Entities;
using ATS.UseCases.Features.Auth.DTOs;

namespace ATS.UseCases.Features.Auth.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        AuthResponseDto GenerateTokens(User user);
        Task LogoutAsync(string? refreshToken);
    }
}
