using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Core.Features.Auth.Exceptions
{
    public class AuthException : Exception
    {
        public AuthException() : base("Authentication error occurred") { }

        public AuthException(string message) : base(message) { }

        public AuthException(string message, Exception innerException)
            : base(message, innerException) { }
        
        public static AuthException InvalidCredentials() =>
            new AuthException("Invalid email or password");

        public static AuthException EmailAlreadyExists(string email) =>
            new AuthException($"User with email {email} already exists");

        public static AuthException UserNotFound(string email) =>
            new AuthException($"User with email {email} not found");

        public static AuthException TokenExpired() =>
            new AuthException("Token has expired");

        public static AuthException InvalidToken() =>
            new AuthException("Invalid token");
    }
}