using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace ATS.Infrastructure.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? UserId
        {
            get
            {
                var id = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                return Guid.TryParse(id, out var guid) ? guid : null;
            }
        }

        public Guid RequiredUserId => UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated or ID is missing in claims.");

        public string Email => User?.FindFirstValue(ClaimTypes.Email) ?? string.Empty;

        public string Role => User?.FindFirstValue(ClaimTypes.Role) ?? "User";

        public string FullName
        {
            get
            {
                var first = User?.FindFirstValue(ClaimTypes.GivenName);
                var last = User?.FindFirstValue(ClaimTypes.Surname);
                return $"{first} {last}".Trim();
            }
        }
    }
}
