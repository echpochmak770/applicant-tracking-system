using System;
using System.Collections.Generic;
using System.Text;
using ATS.Domain.Interfaces;
using ATS.Core.DTOs;
using ATS.Core.DTOs.Auth;

namespace ATS.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    }
}
