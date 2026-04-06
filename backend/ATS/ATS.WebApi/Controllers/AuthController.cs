using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Auth.Commands;
using ATS.UseCases.Features.Auth.DTOs;
using ATS.UseCases.Features.Auth.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ATS.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMediator _mediator;

        public AuthController(
            IAuthService authService,
            ICurrentUserService currentUserService,
            IMediator mediator)
        {
            _authService = authService;
            _currentUserService = currentUserService;
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var authResult = await _authService.RegisterAsync(dto);

            SetTokenCookie("accessToken", authResult.AccessToken, authResult.ExpiresAt);
            SetTokenCookie("refreshToken", authResult.RefreshToken, DateTime.UtcNow.AddDays(7));

            return Ok(new { message = "User registered and logged in successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var authResult = await _authService.LoginAsync(dto);

            SetTokenCookie("accessToken", authResult.AccessToken, authResult.ExpiresAt);
            SetTokenCookie("refreshToken", authResult.RefreshToken, DateTime.UtcNow.AddDays(7));

            return Ok(new { message = "Logged in successfully" });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetMe()
        {
            var result = new UserMeDto
            {
                Id = _currentUserService.RequiredUserId,
                Email = _currentUserService.Email,
                FullName = _currentUserService.FullName,
                Role = _currentUserService.Role
            };

            return Ok(result);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            var result = await _mediator.Send(new RefreshTokenCommand
            {
                RefreshToken = refreshToken
            });

            SetTokenCookie("accessToken", result.AccessToken, result.ExpiresAt);
            SetTokenCookie("refreshToken", result.RefreshToken, DateTime.UtcNow.AddDays(7));

            return Ok(new { message = "Token refreshed successfully" });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _mediator.Send(new LogoutCommand
                {
                    RefreshToken = refreshToken
                });
            }

            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");

            return Ok();
        }

        private void SetTokenCookie(string name, string token, DateTime expiresAt)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Secure = false,
                Expires = expiresAt
            };

            Response.Cookies.Append(name, token, cookieOptions);
        }
    }
}
