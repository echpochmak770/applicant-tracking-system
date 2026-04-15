using ATS.Domain.Entities;
using ATS.Domain.Enums;
using ATS.Domain.Interfaces;
using ATS.Infrastructure.Persistence;
using ATS.Shared.Classes;
using ATS.UseCases.Features.Auth.DTOs;
using ATS.UseCases.Features.Auth.Exceptions;
using ATS.UseCases.Features.Auth.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ATS.Infrastructure.Authentication
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly JwtSettings _jwtSettings;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public AuthService(
            IUserRepository userRepository,
            IOptions<JwtSettings> jwtOptions,
            IUnitOfWork unitOfWork,
            IRefreshTokenRepository refreshTokenRepository)
        {
            _userRepository = userRepository;
            _passwordHasher = new PasswordHasher<User>();
            _jwtSettings = jwtOptions.Value;
            _unitOfWork = unitOfWork;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);

            if (user is null)
            {
                throw AuthException.InvalidCredentials();
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                throw AuthException.InvalidCredentials();
            }

            var response = GenerateTokens(user);

            await SaveRefreshTokenAsync(user.Id, response.RefreshToken);

            return response;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            if (await _userRepository.EmailExistsAsync(dto.Email))
                throw AuthException.EmailAlreadyExists(dto.Email);

            var user = new User
            {
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Phone = dto.Phone,
                Role = UserRole.Recruiter
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            await _userRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            var response = GenerateTokens(user);

            await SaveRefreshTokenAsync(user.Id, response.RefreshToken);

            return response;
        }

        private async Task SaveRefreshTokenAsync(Guid userId, string token)
        {
            var expiresAt = _jwtSettings.RefreshTokenExpirationDays;

            var refreshToken = new RefreshToken
            {
                Token = token,
                UserId = userId,
                ExpiresAt = DateTime.UtcNow.AddDays(expiresAt),
                CreatedAt = DateTime.UtcNow
            };

            await _refreshTokenRepository.AddAsync(refreshToken);
            await _unitOfWork.SaveChangesAsync();
        }

        public AuthResponseDto GenerateTokens(User user)
        {
            var accessTokenExpires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes);
            var accessToken = CreateJwtToken(user, accessTokenExpires);

            var refreshToken = GenerateRefreshTokenString();

            return new AuthResponseDto
            {
                AccessToken = accessToken,
                ExpiresAt = accessTokenExpires,
                RefreshToken = refreshToken
            };
        }

        public async Task LogoutAsync(string? refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken)) return;

            var tokenEntry = await _refreshTokenRepository
                .GetByTokenAsync(refreshToken);

            if (tokenEntry != null)
            {
                _refreshTokenRepository.Delete(tokenEntry);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        private string CreateJwtToken(User user, DateTime expires)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(ClaimTypes.GivenName, user.FirstName),
            new Claim(ClaimTypes.Surname, user.LastName)
        };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshTokenString()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
