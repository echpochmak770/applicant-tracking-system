using ATS.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Entities
{
    public class RefreshToken : BaseEntity
    {
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        public bool IsActive => !IsExpired && !IsDeleted;

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
