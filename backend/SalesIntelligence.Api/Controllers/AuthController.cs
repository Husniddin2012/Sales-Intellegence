using Microsoft.AspNetCore.Mvc;
using SalesIntelligence.Api.Models;
using SalesIntelligence.Api.Services;

namespace SalesIntelligence.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    public IActionResult Login([FromBody] LoginRequestDto request)
    {
        var result = _authService.Login(request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    public IActionResult Register([FromBody] RegisterRequestDto request)
    {
        var result = _authService.Register(request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
    {
        var result = await _authService.ForgotPasswordAsync(request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("verify-otp")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    public IActionResult VerifyOtp([FromBody] VerifyOtpRequestDto request)
    {
        var result = _authService.VerifyOtp(request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    public IActionResult ResetPassword([FromBody] ResetPasswordRequestDto request)
    {
        var result = _authService.ResetPassword(request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    public IActionResult GetCurrentUser([FromHeader(Name = "Authorization")] string? token)
    {
        if (string.IsNullOrWhiteSpace(token)) return Unauthorized();

        try
        {
            var cleanToken = token.Replace("Bearer ", "");
            var decoded = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(cleanToken));
            var parts = decoded.Split(':');
            var user = _authService.GetUserById(parts[0]);

            if (user == null) return Unauthorized();
            return Ok(user);
        }
        catch
        {
            return Unauthorized();
        }
    }

    [HttpGet("users")]
    [ProducesResponseType(typeof(List<UserDto>), StatusCodes.Status200OK)]
    public IActionResult GetAllUsers()
    {
        var users = _authService.GetAllUsers();
        return Ok(users);
    }
}
