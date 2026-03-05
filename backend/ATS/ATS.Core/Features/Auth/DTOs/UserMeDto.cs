using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Core.Features.Auth.DTOs
{
    public class UserMeDto
    {
        public Guid Id { get; init; }
        public string Email { get; init; } = string.Empty;
        public string FullName { get; init; } = string.Empty;
        public string Role { get; init; } = string.Empty;
    }
}
