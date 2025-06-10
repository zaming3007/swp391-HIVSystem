using HIVSystem.Infrastructure.Data;
using HIVSystem.Infrastructure.Repositories;
using HIVSystem.Infrastructure.Services;
using HIVSystem.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HIVSystem.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register database context
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

            // Register repositories
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            services.AddScoped<IDoctorRepository, DoctorRepository>();
            
            // Register services
            services.AddScoped<IAppointmentService, AppointmentService>();
            
            // Register other infrastructure services
            // services.AddTransient<IEmailService, EmailService>();

            return services;
        }
    }
} 