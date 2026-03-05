using ATS.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using System.Text;

namespace ATS.Infrastructure.Persistence.Mocks
{
    public class DesignTimeUserService : ICurrentUserService
    {
        public Guid? UserId => Guid.Empty;

        public Guid RequiredUserId => Guid.Empty;

        public string Email => string.Empty;

        public string FullName => string.Empty;

        public string Role => string.Empty;
    }
}
