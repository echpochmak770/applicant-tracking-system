using System.Net; // Для WebUtility
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
    private readonly IAuthService _authService;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenHandler(
        IRefreshTokenRepository refreshTokenRepository,
        IAuthService authService,
        IUnitOfWork unitOfWork)
    {
        _refreshTokenRepository = refreshTokenRepository;
        _authService = authService;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthResponseDto> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            throw AuthException.InvalidToken();
        }

        var decodedToken = WebUtility.UrlDecode(request.RefreshToken);

        var storedToken = await _refreshTokenRepository.GetByTokenAsync(decodedToken);

        if (storedToken == null || !storedToken.IsActive)
        {
            throw AuthException.InvalidToken();
        }

        if (storedToken.User == null)
        {
            throw AuthException.InvalidToken();
        }

        _refreshTokenRepository.Delete(storedToken);

        var authResponse = _authService.GenerateTokens(storedToken.User);

        var newRefreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = authResponse.RefreshToken,
            UserId = storedToken.UserId,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        await _refreshTokenRepository.AddAsync(newRefreshToken);
        await _unitOfWork.SaveChangesAsync(ct);

        return authResponse;
    }
}