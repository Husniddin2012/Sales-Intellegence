namespace SalesIntelligence.Api.Services;

public interface IEmailService
{
    Task<bool> SendOtpEmailAsync(string toEmail, string fullName, string otpCode);
}
