namespace SalesIntelligence.Api.Domain.Entities;

public class UserEntity
{
    public string Id { get; private set; }
    public string FullName { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    public string CompanyName { get; private set; }
    public string Role { get; private set; }
    public string Avatar { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? LastLoginAt { get; private set; }

    // Security & Lockout
    public int FailedLoginAttempts { get; private set; }
    public DateTime? LockoutUntil { get; private set; }

    // OTP Security
    public string? CurrentOtpCode { get; private set; }
    public DateTime? OtpExpiresAt { get; private set; }
    public int OtpFailedAttempts { get; private set; }
    public bool IsOtpVerified { get; private set; }

    public UserEntity(
        string id,
        string fullName,
        string email,
        string passwordHash,
        string companyName,
        string role = "Ishchi / Sotuv Xodimi",
        string? avatar = null)
    {
        Id = id;
        FullName = fullName;
        Email = email.ToLowerInvariant().Trim();
        PasswordHash = passwordHash;
        CompanyName = companyName;
        Role = role;
        Avatar = avatar ?? $"https://api.dicebear.com/7.x/initials/svg?seed={Uri.EscapeDataString(fullName)}&backgroundColor=0284c7";
        CreatedAt = DateTime.UtcNow;
        FailedLoginAttempts = 0;
        OtpFailedAttempts = 0;
    }

    public bool IsLockedOut()
    {
        if (LockoutUntil.HasValue && LockoutUntil.Value > DateTime.UtcNow)
        {
            return true;
        }
        return false;
    }

    public void RecordFailedLogin()
    {
        FailedLoginAttempts++;
        if (FailedLoginAttempts >= 5)
        {
            // Lock account for 15 minutes after 5 failed attempts
            LockoutUntil = DateTime.UtcNow.AddMinutes(15);
        }
    }

    public void RecordLogin()
    {
        LastLoginAt = DateTime.UtcNow;
        FailedLoginAttempts = 0;
        LockoutUntil = null;
    }

    public bool IsSameAsCurrentPassword(string newHash)
    {
        return string.Equals(PasswordHash, newHash, StringComparison.OrdinalIgnoreCase);
    }

    public void SetPassword(string newHash)
    {
        PasswordHash = newHash;
        CurrentOtpCode = null;
        OtpExpiresAt = null;
        OtpFailedAttempts = 0;
        IsOtpVerified = false;
        FailedLoginAttempts = 0;
        LockoutUntil = null;
    }

    public void GenerateOtp(string code, TimeSpan validDuration)
    {
        CurrentOtpCode = code;
        OtpExpiresAt = DateTime.UtcNow.Add(validDuration);
        OtpFailedAttempts = 0;
        IsOtpVerified = false;
    }

    public bool VerifyOtp(string code)
    {
        if (string.IsNullOrWhiteSpace(CurrentOtpCode) || OtpExpiresAt == null) return false;
        if (DateTime.UtcNow > OtpExpiresAt.Value) return false;
        if (OtpFailedAttempts >= 5) return false; // Max 5 OTP tries

        if (CurrentOtpCode != code.Trim())
        {
            OtpFailedAttempts++;
            return false;
        }

        IsOtpVerified = true;
        return true;
    }
}
