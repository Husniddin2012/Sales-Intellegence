using System.Security.Cryptography;
using System.Text;
using SalesIntelligence.Api.Domain.Entities;
using SalesIntelligence.Api.Models;

namespace SalesIntelligence.Api.Services;

public class AuthService : IAuthService
{
    private static readonly List<UserEntity> _users = [];
    private static readonly object _lock = new();
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;

    private const string SaltPrefix = "SECURE_SALT_SALES_INTEL_2026_V2_";

    public AuthService(IEmailService emailService, ILogger<AuthService> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    static AuthService()
    {
        // 1 ta yagona Admin hisobi (Login: admin, Parol: admin01)
        var admin = new UserEntity(
            id: "usr-admin-01",
            fullName: "Boshqaruvchi (Admin)",
            email: "admin",
            passwordHash: HashPassword("admin01"),
            companyName: "ITLive Global Inc.",
            role: "Boshqaruvchi / Biznes Egasi",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        );

        _users.Clear();
        _users.Add(admin);
    }

    private static UserEntity? FindUserByLoginOrEmail(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return null;
        var normalized = input.Trim().ToLowerInvariant();

        return _users.FirstOrDefault(u =>
            u.Email.Equals(normalized, StringComparison.OrdinalIgnoreCase) ||
            (normalized == "admin" && (u.Email.Equals("admin", StringComparison.OrdinalIgnoreCase) || u.Email.Equals("karoc771@gmail.com", StringComparison.OrdinalIgnoreCase) || u.Role.Contains("Admin") || u.Role.Contains("Boshqaruvchi"))) ||
            (u.Email.Equals("karoc771@gmail.com", StringComparison.OrdinalIgnoreCase) && normalized == "admin")
        );
    }

    public AuthResponseDto Login(LoginRequestDto req)
    {
        lock (_lock)
        {
            var user = FindUserByLoginOrEmail(req.Email);

            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Bunday login yoki emailga ega foydalanuvchi tizimda topilmadi."
                };
            }

            if (user.IsLockedOut())
            {
                var remainingMinutes = Math.Ceiling((user.LockoutUntil!.Value - DateTime.UtcNow).TotalMinutes);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Xavfsizlik sababli hisob vaqtincha bloklangan. Iltimos {remainingMinutes} daqiqadan so'ng qayta urinib ko'ring."
                };
            }

            var hash = HashPassword(req.Password);
            if (!ConstantTimeEquals(user.PasswordHash, hash))
            {
                user.RecordFailedLogin();
                var attemptsLeft = Math.Max(0, 5 - user.FailedLoginAttempts);
                return new AuthResponseDto
                {
                    Success = false,
                    Message = attemptsLeft > 0
                        ? $"Kiritilgan parol noto'g'ri. Qolgan urinishlar: {attemptsLeft}. 'Parolni unutdingizmi?' orqali tiklashingiz mumkin."
                        : "Parol 5 marta xato kiritildi. Hisobingiz 15 daqiqaga xavfsizlik maqsadida bloklandi."
                };
            }

            user.RecordLogin();
            var token = GenerateSecureToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = $"Xush kelibsiz, {user.FullName}!",
                Token = token,
                User = MapToDto(user)
            };
        }
    }

    public AuthResponseDto Register(RegisterRequestDto req)
    {
        lock (_lock)
        {
            var email = req.Email.ToLowerInvariant().Trim();

            if (string.IsNullOrWhiteSpace(req.FullName) || req.FullName.Trim().Length < 2)
            {
                return new AuthResponseDto { Success = false, Message = "Iltimos, to'liq ism-familiyangizni kiriting." };
            }

            if (string.IsNullOrWhiteSpace(req.Password) || req.Password.Length < 6)
            {
                return new AuthResponseDto { Success = false, Message = "Parol kamida 6 ta belgidan iborat bo'lishi kerak." };
            }

            if (_users.Any(u => u.Email == email))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Ushbu email manzili allaqachon ro'yxatdan o'tgan. Kirish tugmasini bosing."
                };
            }

            // Yangi ro'yxatdan o'tuvchilar faqat Ishchi / Sotuv Xodimi
            var newUser = new UserEntity(
                id: $"usr-{Guid.NewGuid():N}"[..12],
                fullName: req.FullName.Trim(),
                email: email,
                passwordHash: HashPassword(req.Password),
                companyName: string.IsNullOrWhiteSpace(req.CompanyName) ? "Kompaniya" : req.CompanyName.Trim(),
                role: "Ishchi / Sotuv Xodimi"
            );

            _users.Add(newUser);
            newUser.RecordLogin();
            var token = GenerateSecureToken(newUser);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Ishchi hisobingiz muvaffaqiyatli yaratildi!",
                Token = token,
                User = MapToDto(newUser)
            };
        }
    }

    public async Task<AuthResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto req)
    {
        string? targetEmail = null;
        string? fullName = null;
        string? otpCode = null;

        lock (_lock)
        {
            if (string.IsNullOrWhiteSpace(req.Email))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Iltimos, login yoki email manzilingizni kiriting."
                };
            }

            var user = FindUserByLoginOrEmail(req.Email);

            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Bunday login yoki emailga ega foydalanuvchi tizimda topilmadi. Parolni faqat mavjud foydalanuvchilar tiklashi mumkin."
                };
            }

            targetEmail = user.Email.Contains("@") ? user.Email : "karoc771@gmail.com";
            fullName = user.FullName;

            // Generate cryptographically secure 6-digit OTP
            otpCode = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
            user.GenerateOtp(otpCode, TimeSpan.FromMinutes(10));
        }

        // Send OTP via MailKit
        var sent = await _emailService.SendOtpEmailAsync(targetEmail, fullName ?? "Foydalanuvchi", otpCode);

        if (sent)
        {
            return new AuthResponseDto
            {
                Success = true,
                Message = $"6 xonali tasdiqlash kodi {targetEmail} pochtasiga yetkazildi! Iltimos pochtangizni tekshiring.",
                SentToEmail = targetEmail
            };
        }
        else
        {
            // If Google rejected credentials, report fallback code
            return new AuthResponseDto
            {
                Success = true,
                Message = $"Google SMTP orqali yuborishda muammo bo'ldi. Sinov uchun tasdiqlash kodi: {otpCode}",
                SentToEmail = targetEmail
            };
        }
    }

    public AuthResponseDto VerifyOtp(VerifyOtpRequestDto req)
    {
        lock (_lock)
        {
            var user = FindUserByLoginOrEmail(req.Email);

            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Bunday login yoki emailga ega foydalanuvchi tizimda topilmadi."
                };
            }

            var verified = user.VerifyOtp(req.OtpCode);
            if (!verified)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Kiritilgan 6 xonali kod noto'g'ri yoki muddati o'tgan. Iltimos qaytadan tekshirib kiriting."
                };
            }

            return new AuthResponseDto
            {
                Success = true,
                Message = "Email muvaffaqiyatli tasdiqlandi! Endi yangi parolingizni o'rnating."
            };
        }
    }

    public AuthResponseDto ResetPassword(ResetPasswordRequestDto req)
    {
        lock (_lock)
        {
            var user = FindUserByLoginOrEmail(req.Email);

            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Bunday login yoki emailga ega foydalanuvchi tizimda topilmadi."
                };
            }

            if (string.IsNullOrWhiteSpace(req.NewPassword) || req.NewPassword.Length < 6)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak."
                };
            }

            if (!user.IsOtpVerified && !user.VerifyOtp(req.OtpCode))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Tasdiqlash kodi yaroqsiz yoki muddati o'tgan."
                };
            }

            var newHash = HashPassword(req.NewPassword);

            // Avvalgi (hozirgi) parolini qayta qo'yishni taqiqlash
            if (user.IsSameAsCurrentPassword(newHash) || ConstantTimeEquals(user.PasswordHash, newHash))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Yangi parol avvalgi (hozirgi) parolingiz bilan bir xil bo'lishi mumkin emas. Iltimos, boshqa yangi parol kiriting."
                };
            }

            user.SetPassword(newHash);
            user.RecordLogin();
            var token = GenerateSecureToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Parolingiz muvaffaqiyatli yangilandi! Tizimga kirdingiz.",
                Token = token,
                User = MapToDto(user)
            };
        }
    }

    public UserDto? GetUserById(string userId)
    {
        lock (_lock)
        {
            var user = _users.FirstOrDefault(u => u.Id == userId);
            return user == null ? null : MapToDto(user);
        }
    }

    public List<UserDto> GetAllUsers()
    {
        lock (_lock)
        {
            return _users.Select(MapToDto).ToList();
        }
    }

    private static string HashPassword(string password)
    {
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(SaltPrefix));
        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(password + "SALES_INTELLIGENCE_HIGH_SECURITY_SALT_2026"));
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    private static bool ConstantTimeEquals(string a, string b)
    {
        var aBytes = Encoding.UTF8.GetBytes(a);
        var bBytes = Encoding.UTF8.GetBytes(b);
        return CryptographicOperations.FixedTimeEquals(aBytes, bBytes);
    }

    private static string GenerateSecureToken(UserEntity user)
    {
        var payload = $"{user.Id}:{user.Email}:{user.Role}:{DateTime.UtcNow.Ticks}:{Guid.NewGuid():N}";
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes("SALES_INTEL_JWT_HMAC_SIGNATURE_KEY_2026"));
        var signature = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(payload)));
        return Convert.ToBase64String(Encoding.UTF8.GetBytes($"{payload}:{signature}"));
    }

    private static UserDto MapToDto(UserEntity u)
    {
        return new UserDto(
            Id: u.Id,
            FullName: u.FullName,
            Email: u.Email,
            CompanyName: u.CompanyName,
            Role: u.Role,
            Avatar: u.Avatar
        );
    }
}
