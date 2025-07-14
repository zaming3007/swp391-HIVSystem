using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace AuthApi.Services
{
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = string.Empty;
        public int SmtpPort { get; set; }
        public string SmtpUser { get; set; } = string.Empty;
        public string SmtpPass { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = string.Empty;
    }

    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task SendPasswordResetCodeAsync(string email, string code)
        {
            var subject = "Mã xác minh đặt lại mật khẩu - HIV Treatment Center";
            var body = GeneratePasswordResetEmailBody(code);

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendWelcomeEmailAsync(string email, string firstName)
        {
            var subject = "Chào mừng đến với HIV Treatment Center";
            var body = GenerateWelcomeEmailBody(firstName);

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendAppointmentConfirmationAsync(string email, string appointmentDetails)
        {
            var subject = "Xác nhận lịch hẹn - HIV Treatment Center";
            var body = GenerateAppointmentEmailBody(appointmentDetails);

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                // Check if email settings are configured
                if (string.IsNullOrEmpty(_emailSettings.SmtpUser) ||
                    string.IsNullOrEmpty(_emailSettings.SmtpPass) ||
                    _emailSettings.SmtpUser == "your-email@gmail.com" ||
                    _emailSettings.SmtpUser == "YOUR_GMAIL@gmail.com" ||
                    _emailSettings.SmtpPass == "YOUR_16_DIGIT_APP_PASSWORD")
                {
                    _logger.LogWarning("Email settings not configured. Skipping email send.");
                    // For development, just log the email content
                    _logger.LogInformation($"[MOCK EMAIL] To: {toEmail}, Subject: {subject}");
                    return;
                }

                using var client = new SmtpClient(_emailSettings.SmtpHost, _emailSettings.SmtpPort);
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(_emailSettings.SmtpUser, _emailSettings.SmtpPass);
                client.DeliveryMethod = SmtpDeliveryMethod.Network;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}");

                // For development, don't throw error, just log
                if (_emailSettings.SmtpUser == "your-email@gmail.com" ||
                    _emailSettings.SmtpUser == "YOUR_GMAIL@gmail.com" ||
                    _emailSettings.SmtpPass == "YOUR_16_DIGIT_APP_PASSWORD" ||
                    string.IsNullOrEmpty(_emailSettings.SmtpUser))
                {
                    _logger.LogWarning("Email not configured for development. Continuing without sending email.");
                    return;
                }

                throw;
            }
        }

        private string GeneratePasswordResetEmailBody(string code)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <title>Mã xác minh đặt lại mật khẩu</title>
    <meta charset='utf-8'>
</head>
<body style='margin: 0; padding: 0; font-family: Arial, sans-serif;'>
    <div style='max-width: 600px; margin: 0 auto;'>
        <!-- Header -->
        <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;'>
            <h1 style='color: white; margin: 20px 0; font-size: 28px;'>Mã xác minh</h1>
        </div>
        
        <!-- Content -->
        <div style='padding: 40px; background: #f8f9fa; text-align: center;'>
            <h2 style='color: #333; margin-bottom: 20px;'>Đặt lại mật khẩu</h2>
            <p style='color: #666; font-size: 16px; margin-bottom: 30px;'>
                Nhập mã xác minh bên dưới để đặt lại mật khẩu của bạn:
            </p>
            
            <!-- Mã xác minh -->
            <div style='background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 30px; margin: 30px 0;'>
                <div style='font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: ""Courier New"", monospace;'>
                    {code}
                </div>
            </div>
            
            <!-- Thông tin -->
            <div style='background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 20px; margin: 20px 0;'>
                <p style='margin: 0; color: #856404;'>
                    <strong>⏰ Mã này có hiệu lực trong 5 phút</strong><br>
                    🔒 Không chia sẻ mã này với bất kỳ ai
                </p>
            </div>
            
            <p style='color: #666; font-size: 14px;'>
                Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
            </p>
        </div>
        
        <!-- Footer -->
        <div style='padding: 20px; text-align: center; color: #666; font-size: 12px;'>
            <p>© 2025 Trung tâm HIV/AIDS. Mọi quyền được bảo lưu.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateWelcomeEmailBody(string firstName)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <title>Chào mừng đến với HIV Treatment Center</title>
    <meta charset='utf-8'>
</head>
<body style='margin: 0; padding: 0; font-family: Arial, sans-serif;'>
    <div style='max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;'>
            <h1 style='color: white; margin: 20px 0;'>Chào mừng {firstName}!</h1>
        </div>
        <div style='padding: 40px; background: #f8f9fa;'>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại Trung tâm HIV/AIDS.</p>
            <p>Chúng tôi cam kết cung cấp dịch vụ chăm sóc sức khỏe tốt nhất cho bạn.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GenerateAppointmentEmailBody(string appointmentDetails)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <title>Xác nhận lịch hẹn</title>
    <meta charset='utf-8'>
</head>
<body style='margin: 0; padding: 0; font-family: Arial, sans-serif;'>
    <div style='max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;'>
            <h1 style='color: white; margin: 20px 0;'>Xác nhận lịch hẹn</h1>
        </div>
        <div style='padding: 40px; background: #f8f9fa;'>
            <p>Lịch hẹn của bạn đã được xác nhận:</p>
            <div style='background: white; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                {appointmentDetails}
            </div>
        </div>
    </div>
</body>
</html>";
        }
    }
}
