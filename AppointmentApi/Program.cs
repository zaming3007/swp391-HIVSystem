using System.Text;
using AppointmentApi.Models;
using AppointmentApi.Services;
using AppointmentApi.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Diagnostics;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Thêm CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});

// Thêm EntityFramework với PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    Console.WriteLine($"Connection string: {connectionString}");
    options.UseNpgsql(connectionString);
});

// Cấu hình JWT Authentication
var jwtSection = builder.Configuration.GetSection("JwtSettings");
var jwtSettings = new JwtSettings
{
    Key = jwtSection["Key"] ?? "YourSuperSecretKeyMustBeAtLeast32Characters",
    Issuer = jwtSection["Issuer"] ?? "AppointmentApi",
    Audience = jwtSection["Audience"] ?? "React",
    ExpiryMinutes = int.Parse(jwtSection["ExpiryMinutes"] ?? "60")
};

builder.Services.AddSingleton(jwtSettings);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Key))
        };
    });

// Đăng ký các service trong DI container
// Giữ lại các service hiện có nhưng thêm mới với Entity Framework
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IServiceManager, ServiceManager>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Appointment API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
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

var app = builder.Build();

// Thêm endpoint root đơn giản cho healthcheck
app.MapGet("/", () => 
{
    Console.WriteLine("Root endpoint accessed");
    return "AppointmentApi is running!";
});

// Thêm middleware để hiển thị lỗi chi tiết
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        context.Response.ContentType = "text/plain";

        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        if (exception != null)
        {
            await context.Response.WriteAsync($"Error: {exception.Message}\n\nStack Trace: {exception.StackTrace}");
            Console.WriteLine($"Error: {exception.Message}\n\nStack Trace: {exception.StackTrace}");
        }
        else
        {
            await context.Response.WriteAsync("An error occurred.");
        }
    });
});

// Migrate and seed database at startup
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        Console.WriteLine("Attempting database migration...");
        dbContext.Database.Migrate();
        Console.WriteLine("Database migration completed successfully.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"An error occurred while migrating the database: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
}

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// Comment dòng này để tránh redirect HTTPS trên Railway
// app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

Console.WriteLine("AppointmentApi is starting...");
Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");
Console.WriteLine("Listening on port 80");

app.Run(); 