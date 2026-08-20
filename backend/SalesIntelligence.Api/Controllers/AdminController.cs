using Microsoft.AspNetCore.Mvc;
using SalesIntelligence.Api.Domain.Entities;
using SalesIntelligence.Api.Models;
using SalesIntelligence.Api.Services;

namespace SalesIntelligence.Api.Controllers;

public record SystemSettingsDto(
    int TargetResponseMinutes,
    int CriticalDelayMinutes,
    bool AutoReassignEnabled,
    string NotificationChannel,
    decimal MonthlyAdBudgetCap,
    string DefaultAssigneeRole
);

public record AuditLogDto(
    string Id,
    string ActionName,
    string PerformedBy,
    string TargetEntity,
    string Details,
    DateTime Timestamp
);

public record CreateUserRequestDto(
    string FullName,
    string Email,
    string Role,
    string CompanyName,
    string Password
);

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private static SystemSettingsDto _settings = new(
        TargetResponseMinutes: 5,
        CriticalDelayMinutes: 30,
        AutoReassignEnabled: true,
        NotificationChannel: "Telegram & Webhook",
        MonthlyAdBudgetCap: 5000m,
        DefaultAssigneeRole: "Top Closer"
    );

    private static readonly List<AuditLogDto> _auditLogs = [
        new("log-1", "SLA Ogohlantirish", "Husniddin Husanboyev", "Sardor & Madina", "Kechikayotgan agentlarga Telegram orqali SLA xabarnomasi yuborildi", DateTime.UtcNow.AddHours(-1)),
        new("log-2", "Mahsulot X Chegirma", "Husniddin Husanboyev", "Smart Pro X", "-10% Promo va Bepul yetkazish yoqildi", DateTime.UtcNow.AddHours(-3)),
        new("log-3", "Kreativlar Yangilandi", "Husniddin Husanboyev", "Meta Ads", "Instagram kampaniyalari byudjeti qayta taqsimlandi", DateTime.UtcNow.AddHours(-6)),
        new("log-4", "Tizim Boshlang'ich Sozlash", "System", "Config", "Sales Intelligence 2.0 ishga tushirildi", DateTime.UtcNow.AddDays(-1))
    ];

    private readonly IAuthService _authService;

    public AdminController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet("settings")]
    public IActionResult GetSettings() => Ok(_settings);

    [HttpPost("settings")]
    public IActionResult UpdateSettings([FromBody] SystemSettingsDto updated)
    {
        _settings = updated;
        _auditLogs.Insert(0, new(
            Id: $"log-{Guid.NewGuid():N}"[..8],
            ActionName: "CRM Sozlamalari Yangilandi",
            PerformedBy: "Husniddin Husanboyev",
            TargetEntity: "System Settings",
            Details: $"SLA: {updated.TargetResponseMinutes} min, AutoReassign: {updated.AutoReassignEnabled}",
            Timestamp: DateTime.UtcNow
        ));
        return Ok(new { success = true, message = "Sozlamalar muvaffaqiyatli saqlandi!", settings = _settings });
    }

    [HttpGet("audit-logs")]
    public IActionResult GetAuditLogs() => Ok(_auditLogs);

    [HttpPost("users")]
    public IActionResult CreateUser([FromBody] CreateUserRequestDto req)
    {
        var result = _authService.Register(new RegisterRequestDto(
            FullName: req.FullName,
            Email: req.Email,
            Password: req.Password,
            CompanyName: req.CompanyName
        ));

        if (!result.Success) return BadRequest(result);

        _auditLogs.Insert(0, new(
            Id: $"log-{Guid.NewGuid():N}"[..8],
            ActionName: "Yangi Xodim Qo'shildi",
            PerformedBy: "Husniddin Husanboyev",
            TargetEntity: req.Email,
            Details: $"Ism: {req.FullName}, Rol: {req.Role}",
            Timestamp: DateTime.UtcNow
        ));

        return Ok(new { success = true, message = $"Foydalanuvchi {req.FullName} muvaffaqiyatli yaratildi!", user = result.User });
    }
}
