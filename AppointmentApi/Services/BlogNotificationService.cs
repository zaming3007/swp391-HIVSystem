using AppointmentApi.Data;
using AppointmentApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AppointmentApi.Services
{
    public class BlogNotificationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<BlogNotificationService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(30); // Check every 30 minutes

        public BlogNotificationService(IServiceProvider serviceProvider, ILogger<BlogNotificationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Blog Notification Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckAndNotifyNewBlogPosts();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while checking new blog posts");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task CheckAndNotifyNewBlogPosts()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

            try
            {
                // Get blog posts published in the last 30 minutes that haven't been notified
                var thirtyMinutesAgo = DateTime.UtcNow.AddMinutes(-30);

                // TODO: Uncomment when BlogPosts table is added to ApplicationDbContext
                var newBlogPosts = new List<dynamic>(); // Temporary placeholder
                /*
                var newBlogPosts = await context.BlogPosts
                    .Where(bp => bp.Status == "published" &&
                                bp.CreatedAt >= thirtyMinutesAgo &&
                                !context.Notifications.Any(n =>
                                    n.RelatedEntityId == bp.Id &&
                                    n.Type == NotificationTypes.BLOG))
                    .ToListAsync();
                */

                foreach (var blogPost in newBlogPosts)
                {
                    try
                    {
                        // TODO: Uncomment when BlogPosts table is available
                        /*
                        // Get all active users (customers) to notify about new blog posts
                        var activeUsers = await GetActiveCustomersAsync(context);

                        foreach (var userId in activeUsers)
                        {
                            await notificationService.NotifyNewBlogPostAsync(
                                userId,
                                blogPost.Title,
                                blogPost.Category ?? "Tổng hợp"
                            );
                        }

                        _logger.LogInformation($"Blog post notification sent for '{blogPost.Title}' to {activeUsers.Count} users");
                        */
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to send blog post notification");
                    }
                }

                if (newBlogPosts.Any())
                {
                    _logger.LogInformation($"Processed {newBlogPosts.Count} new blog posts for notifications");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CheckAndNotifyNewBlogPosts");
            }
        }

        private async Task<List<string>> GetActiveCustomersAsync(ApplicationDbContext context)
        {
            try
            {
                // This would typically call AuthApi to get active customer users
                // For now, we'll get users from recent appointments as a proxy for active users
                var recentActiveUsers = await context.Appointments
                    .Where(a => a.CreatedAt >= DateTime.UtcNow.AddDays(-30))
                    .Select(a => a.PatientId)
                    .Distinct()
                    .ToListAsync();

                // Add some default test users
                var defaultUsers = new[] { "customer-001", "customer-002", "customer-003" };

                var allUsers = recentActiveUsers.Union(defaultUsers).Distinct().ToList();

                return allUsers;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active customers");
                return new List<string> { "customer-001" }; // Fallback to test user
            }
        }
    }
}
