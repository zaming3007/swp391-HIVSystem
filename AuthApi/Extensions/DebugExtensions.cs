using System.Text.RegularExpressions;

namespace AuthApi.Extensions
{
    public static class DebugExtensions
    {
        public static string MaskPassword(this string connectionString)
        {
            if (string.IsNullOrEmpty(connectionString))
                return connectionString;

            // Mask password in connection string
            return Regex.Replace(
                connectionString,
                @"Password=([^;]*)",
                "Password=******",
                RegexOptions.IgnoreCase
            );
        }
    }
} 