using ATS.UseCases.Features.Auth.DTOs;
using ATS.UseCases.Features.Auth.Interfaces;
using ATS.Domain.Interfaces;
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

        public AuthController(IAuthService authService, ICurrentUserService currentUserService)
        {
            _authService = authService;
            _currentUserService = currentUserService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var authResult = await _authService.RegisterAsync(dto);
            SetTokenCookie(authResult.AccessToken, authResult.ExpiresAt);

            return Ok(new { message = "User registered and logged in successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var authResult = await _authService.LoginAsync(dto);
            SetTokenCookie(authResult.AccessToken, authResult.ExpiresAt);

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

        private void SetTokenCookie(string token, DateTime expiresAt)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Secure = false,
                Expires = expiresAt
            };

            Response.Cookies.Append("accessToken", token, cookieOptions);
        }
    }
}
