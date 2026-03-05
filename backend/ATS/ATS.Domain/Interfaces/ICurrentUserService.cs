using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface ICurrentUserService
    {
        Guid? UserId { get; }
        Guid RequiredUserId { get; }
        string Email { get; }
        string FullName { get; }
        string Role { get; }
    }
}
