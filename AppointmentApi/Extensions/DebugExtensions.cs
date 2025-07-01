using System.Text.Json;

namespace AppointmentApi.Extensions
{
    public static class DebugExtensions
    {
        public static string ToDebugString<T>(this T obj)
        {
            try
            {
                return JsonSerializer.Serialize(obj, new JsonSerializerOptions
                {
                    WriteIndented = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
            }
            catch (Exception ex)
            {
                return $"Error serializing object: {ex.Message}";
            }
        }
    }
} 