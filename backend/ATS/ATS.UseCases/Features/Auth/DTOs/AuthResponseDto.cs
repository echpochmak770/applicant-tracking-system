using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Auth.DTOs
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }
}
