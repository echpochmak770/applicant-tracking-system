using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface ICurrentUserService
    {
        Guid? UserId { get; }
    }
}
