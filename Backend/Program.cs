using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Add services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Add specific routes for AppointmentController
app.MapControllerRoute(
    name: "doctorAppointments",
    pattern: "api/Appointment/doctor/{doctorId}",
    defaults: new { controller = "Appointment", action = "GetDoctorAppointments" }
);

app.MapControllerRoute(
    name: "patientAppointments",
    pattern: "api/Appointment/patient/{patientId}",
    defaults: new { controller = "Appointment", action = "GetPatientAppointments" }
);

app.MapControllerRoute(
    name: "completeAppointment",
    pattern: "api/Appointment/{id}/complete",
    defaults: new { controller = "Appointment", action = "MarkAsCompleted" }
);

app.MapControllerRoute(
    name: "cancelAppointment",
    pattern: "api/Appointment/{id}/cancel",
    defaults: new { controller = "Appointment", action = "CancelAppointment" }
);

app.Run(); 