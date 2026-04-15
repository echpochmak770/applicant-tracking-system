using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Auth.Exceptions
{
    public class AuthException : Exception
    {
        public int StatusCode { get; }

        public AuthException(string message, int statusCode = 401) : base(message)
        {
            StatusCode = statusCode;
        }

        public static AuthException InvalidCredentials() =>
            new AuthException("Invalid email or password", 400);

        public static AuthException EmailAlreadyExists(string email) =>
            new AuthException($"User with email {email} already exists", 400);

        public static AuthException TokenExpired() =>
            new AuthException("Token has expired", 401);

        public static AuthException InvalidToken() =>
            new AuthException("Invalid token", 401);
    }
}