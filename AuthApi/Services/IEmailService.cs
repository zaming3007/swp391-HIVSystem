namespace AuthApi.Services
{
    public interface IEmailService
    {
        Task SendPasswordResetCodeAsync(string email, string code);
        Task SendWelcomeEmailAsync(string email, string firstName);
        Task SendAppointmentConfirmationAsync(string email, string appointmentDetails);
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}
