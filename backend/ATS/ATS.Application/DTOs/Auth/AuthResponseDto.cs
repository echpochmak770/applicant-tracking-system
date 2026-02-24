using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Core.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }
}
