using System.Text;
using AppointmentApi.Models;
using AppointmentApi.Services;
using AppointmentApi.Data;
using AppointmentApi.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Thêm SignalR
builder.Services.AddSignalR();

// Thêm CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("*")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Thêm EntityFramework với PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // Đọc chuỗi kết nối từ biến môi trường nếu có
    var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ??
                           builder.Configuration.GetConnectionString("DefaultConnection");

    Console.WriteLine($"Connection string source: {(Environment.GetEnvironmentVariable("DATABASE_URL") != null ? "Environment variable" : "Configuration file")}");
    Console.WriteLine($"Connection string: {connectionString}");

    options.UseNpgsql(connectionString);
});

// In thông tin cấu hình JWT
Console.WriteLine("JWT Settings:");
Console.WriteLine($"  Issuer: {builder.Configuration["JwtSettings:Issuer"]}");
Console.WriteLine($"  Audience: {builder.Configuration["JwtSettings:Audience"]}");
Console.WriteLine($"  SecretKey exists: {!string.IsNullOrEmpty(builder.Configuration["JwtSettings:SecretKey"])}");

// Cấu hình JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"] ?? string.Empty))
        };

        // Thêm event handlers để debug JWT
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return System.Threading.Tasks.Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated successfully");
                return System.Threading.Tasks.Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                Console.WriteLine($"Challenge:");
                Console.WriteLine($"  Error: {context.Error}");
                Console.WriteLine($"  ErrorDescription: {context.ErrorDescription}");
                Console.WriteLine($"  AuthenticateFailure: {context.AuthenticateFailure?.Message}");
                Console.WriteLine($"  Request Path: {context.Request.Path}");
                return System.Threading.Tasks.Task.CompletedTask;
            },
            OnMessageReceived = context =>
            {
                Console.WriteLine("Token received for validation");
                return System.Threading.Tasks.Task.CompletedTask;
            }
        };
    });

// Thêm Health Checks
builder.Services.AddHealthChecks();

// Thêm Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AppointmentApi", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Đăng ký các dịch vụ
builder.Services.AddScoped<IDoctorService, AppointmentApi.Services.DoctorService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IServiceManager, ServiceManager>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Đăng ký background services
builder.Services.AddHostedService<AppointmentReminderService>();
builder.Services.AddHostedService<MedicationReminderService>();
builder.Services.AddHostedService<BlogNotificationService>();
builder.Services.AddHostedService<ConsultationNotificationService>();
builder.Services.AddHostedService<UserManagementNotificationService>();

var app = builder.Build();

// Thêm endpoint root đơn giản cho healthcheck
app.MapGet("/", () =>
{
    Console.WriteLine("Root endpoint accessed");
    return "AppointmentApi is running!";
});

app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var result = System.Text.Json.JsonSerializer.Serialize(
            new
            {
                status = report.Status.ToString(),
                checks = report.Entries.Select(e => new
                {
                    name = e.Key,
                    status = e.Value.Status.ToString(),
                    description = e.Value.Description
                })
            });
        Console.WriteLine($"Health check executed: {result}");
        await context.Response.WriteAsync(result);
    }
});

// Migrate database at startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        Console.WriteLine("Attempting database migration...");
        dbContext.Database.Migrate();
        Console.WriteLine("Database migration completed successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while migrating the database: {ex.Message}");
    }

    // Create TestResults table if it doesn't exist
    try
    {
        Console.WriteLine("Creating TestResults table...");
        var sql = @"
            CREATE TABLE IF NOT EXISTS ""TestResults"" (
                ""Id"" text NOT NULL,
                ""PatientId"" text NOT NULL,
                ""DoctorId"" text NOT NULL,
                ""TestType"" character varying(50) NOT NULL,
                ""TestName"" character varying(200) NOT NULL,
                ""Result"" character varying(500) NOT NULL,
                ""Unit"" character varying(50),
                ""ReferenceRange"" character varying(200),
                ""Status"" character varying(50) NOT NULL,
                ""TestDate"" timestamp with time zone NOT NULL,
                ""LabName"" character varying(200),
                ""Notes"" character varying(1000),
                ""CreatedAt"" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
                ""UpdatedAt"" timestamp with time zone,
                CONSTRAINT ""PK_TestResults"" PRIMARY KEY (""Id"")
            );";

        dbContext.Database.ExecuteSqlRaw(sql);
        Console.WriteLine("TestResults table created successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error creating TestResults table: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// Use CORS
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Map SignalR Hub
app.MapHub<NotificationHub>("/notificationHub");

Console.WriteLine($"AppointmentApi is starting in {app.Environment.EnvironmentName} environment");
Console.WriteLine($"ASPNETCORE_URLS: {Environment.GetEnvironmentVariable("ASPNETCORE_URLS")}");

app.Run();