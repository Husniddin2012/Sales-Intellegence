using SalesIntelligence.Api.Models;

namespace SalesIntelligence.Api.Services;

public interface IAuthService
{
    AuthResponseDto Login(LoginRequestDto request);
    AuthResponseDto Register(RegisterRequestDto request);
    Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto request);
    AuthResponseDto VerifyOtp(VerifyOtpRequestDto request);
    AuthResponseDto ResetPassword(ResetPasswordRequestDto request);
    UserDto? GetUserById(string userId);
    List<UserDto> GetAllUsers();
}
