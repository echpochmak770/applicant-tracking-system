using ATS.Core.Features.Auth.DTOs;
using ATS.Core.Features.Auth.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ATS.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

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
    }
}
