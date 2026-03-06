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

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var authResult = await _authService.LoginAsync(dto);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = authResult.ExpiresAt
            };

            Response.Cookies.Append("accessToken", authResult.AccessToken, cookieOptions);

            return Ok(new { message = "Logged in successfully" });
        }

        [HttpGet("me")]
        [Authorize]
        public ActionResult<UserMeDto> GetMe()
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
    }
}
