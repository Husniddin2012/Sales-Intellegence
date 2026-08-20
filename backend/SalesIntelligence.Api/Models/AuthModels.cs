namespace SalesIntelligence.Api.Models;

public record LoginRequestDto(string Email, string Password, string? SelectedRole = null);

public record RegisterRequestDto(
    string FullName,
    string Email,
    string Password,
    string CompanyName
);

public record ForgotPasswordRequestDto(string Email);

public record VerifyOtpRequestDto(string Email, string OtpCode);

public record ResetPasswordRequestDto(
    string Email,
    string OtpCode,
    string NewPassword
);

public record UserDto(
    string Id,
    string FullName,
    string Email,
    string CompanyName,
    string Role,
    string Avatar
);

public record AuthResponseDto
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public string? Token { get; init; }
    public UserDto? User { get; init; }
    public string? SentToEmail { get; init; }
}
