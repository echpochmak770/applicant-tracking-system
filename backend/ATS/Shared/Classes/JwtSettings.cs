namespace ATS.Shared.Classes
{
    public class JwtSettings
    {
        public string Secret { get; set; } = null!;
        public int ExpirationMinutes { get; set; }
    }
}
