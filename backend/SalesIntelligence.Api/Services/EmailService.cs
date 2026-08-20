using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace SalesIntelligence.Api.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task<bool> SendOtpEmailAsync(string toEmail, string fullName, string otpCode)
    {
        var host = _config["Smtp:Host"] ?? "smtp.gmail.com";
        var portStr = _config["Smtp:Port"] ?? "587";
        int.TryParse(portStr, out var port);
        if (port == 0) port = 587;

        var username = (_config["Smtp:Username"] ?? "").Trim();
        var rawPassword = (_config["Smtp:Password"] ?? "").Trim();

        var fromEmail = (_config["Smtp:FromEmail"] ?? "").Trim();
        if (string.IsNullOrEmpty(fromEmail))
        {
            fromEmail = username;
        }

        var fromName = _config["Smtp:FromName"] ?? "Sales Intelligence Xavfsizlik";

        var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #030712; color: #f8fafc; margin: 0; padding: 20px; }}
    .container {{ max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }}
    .header {{ text-align: center; margin-bottom: 24px; }}
    .badge {{ display: inline-block; background: #0284c7; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px; }}
    .title {{ font-size: 22px; font-weight: 800; color: #38bdf8; margin: 0; }}
    .content {{ font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }}
    .code-box {{ background: #1e293b; border: 2px dashed #0284c7; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0; }}
    .code {{ font-family: 'Courier New', monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; }}
    .footer {{ font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; }}
    .warning {{ font-size: 12px; color: #f59e0b; background: rgba(245,158,11,0.1); padding: 10px; border-radius: 8px; margin-top: 16px; border-left: 3px solid #f59e0b; }}
</style>
</head>
<body>
<div class='container'>
    <div class='header'>
        <div class='badge'>Sales Intelligence Xavfsizlik Xizmati</div>
        <h1 class='title'>Parolni Qayta Tiklash</h1>
    </div>
    <div class='content'>
        <p>Hurmatli <strong>{fullName}</strong>,</p>
        <p>Sizning hisobingiz uchun parolni tiklash so'rovi berildi. Yangi parol o'rnatish uchun quyidagi 6 xonali maxsus bir martalik tasdiqlash kodini kiriting:</p>
        <div class='code-box'>
            <div class='code'>{otpCode}</div>
        </div>
        <p style='text-align: center; color: #94a3b8; font-size: 12px;'>Ushbu kod <strong>10 daqiqa</strong> davomida amal qiladi.</p>
        <div class='warning'>
            ⚠️ Agar siz ushbu so'rovni yubormagan bo'lsangiz, xabarni e'tiborsiz qoldiring. Hisobingiz xavfsiz holatda.
        </div>
    </div>
    <div class='footer'>
        &copy; {DateTime.UtcNow.Year} Sales Intelligence AI Platform. Barcha huquqlar himoyalangan.
    </div>
</div>
</body>
</html>";

        // Attempt 1: password without spaces, Attempt 2: password with spaces, Attempt 3: port 465 SSL
        if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(rawPassword))
        {
            var passwordsToTry = new[] { rawPassword.Replace(" ", ""), rawPassword };
            var portsToTry = new[] { (587, SecureSocketOptions.StartTls), (465, SecureSocketOptions.SslOnConnect) };

            foreach (var pwd in passwordsToTry)
            {
                foreach (var (p, sec) in portsToTry)
                {
                    try
                    {
                        var message = new MimeMessage();
                        message.From.Add(new MailboxAddress(fromName, fromEmail));
                        message.To.Add(new MailboxAddress(fullName, toEmail));
                        message.Subject = "Sales Intelligence - Parolni Qayta Tiklash Kodi: " + otpCode;

                        var bodyBuilder = new BodyBuilder
                        {
                            HtmlBody = htmlBody,
                            TextBody = $"Tasdiqlash kodi: {otpCode} (10 daqiqa amal qiladi)"
                        };
                        message.Body = bodyBuilder.ToMessageBody();

                        using var client = new SmtpClient();
                        client.Timeout = 10000;
                        await client.ConnectAsync(host, p, sec);
                        await client.AuthenticateAsync(username, pwd);
                        await client.SendAsync(message);
                        await client.DisconnectAsync(true);

                        _logger.LogInformation("=================================================");
                        _logger.LogInformation("[MailKit] Real OTP email successfully delivered to {ToEmail} via port {Port}!", toEmail, p);
                        _logger.LogInformation("=================================================");
                        return true;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning("[MailKit attempt on port {Port}] Auth result: {Message}", p, ex.Message);
                    }
                }
            }

            _logger.LogError("[MailKit Error] All SMTP attempts failed for {Username}. Security OTP Code for {ToEmail}: >>> {OtpCode} <<<", username, toEmail, otpCode);
            return false;
        }
        else
        {
            _logger.LogWarning("==================================================================");
            _logger.LogWarning("[SMTP SOZLANMAGAN] appsettings.json da Smtp:Username va Smtp:Password kiritilmagan!");
            _logger.LogWarning("Yuborilishi kerak bo'lgan email: {ToEmail}", toEmail);
            _logger.LogWarning("Xavfsizlik OTP kodi: >>> {OtpCode} <<< (10 daqiqa amal qiladi)", otpCode);
            _logger.LogWarning("==================================================================");
            return true;
        }
    }
}
