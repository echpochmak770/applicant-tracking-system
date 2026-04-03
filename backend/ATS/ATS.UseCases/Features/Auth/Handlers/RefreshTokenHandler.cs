using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Auth.Commands;
using ATS.UseCases.Features.Auth.DTOs;
using ATS.UseCases.Features.Auth.Exceptions;
using ATS.UseCases.Features.Auth.Interfaces;
using MediatR;

public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, AuthResponseDto>
{
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAuthService _authService;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenHandler(
        IRefreshTokenRepository refreshTokenRepository,
        IUserRepository userRepository,
        IAuthService authService,
        IUnitOfWork unitOfWork)
    {
        _refreshTokenRepository = refreshTokenRepository;
        _userRepository = userRepository;
        _authService = authService;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthResponseDto> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            throw AuthException.InvalidToken();
        }

        var storedToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken);

        if (storedToken == null || !storedToken.IsActive)
        {
            throw AuthException.InvalidToken();
        }

        _refreshTokenRepository.Delete(storedToken);

        var authResponse = _authService.GenerateTokens(storedToken.User);

        var newRefreshToken = new RefreshToken
        {
            Token = authResponse.RefreshToken,
            UserId = storedToken.UserId,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        await _refreshTokenRepository.AddAsync(newRefreshToken);

        await _unitOfWork.SaveChangesAsync(ct);

        return authResponse;
    }
}