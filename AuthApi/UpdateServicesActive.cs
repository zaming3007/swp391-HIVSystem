using Microsoft.EntityFrameworkCore;
using AuthApi.Data;

namespace AuthApi
{
    public class UpdateServicesActive
    {
        public static async Task UpdateAllServicesToActive(ApplicationDbContext context)
        {
            try
            {
                // Update all services to be active
                await context.Database.ExecuteSqlRawAsync("UPDATE \"Services\" SET is_active = true");
                
                Console.WriteLine("All services updated to active successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating services: {ex.Message}");
            }
        }
    }
}
