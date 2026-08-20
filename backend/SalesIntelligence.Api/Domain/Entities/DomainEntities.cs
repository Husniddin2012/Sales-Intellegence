using SalesIntelligence.Api.Domain.Enums;
using SalesIntelligence.Api.Domain.ValueObjects;

namespace SalesIntelligence.Api.Domain.Entities;

public class LeadEntity
{
    public string Id { get; private set; }
    public string CustomerName { get; private set; }
    public string Phone { get; private set; }
    public string InstagramHandle { get; private set; }
    public string Channel { get; private set; }
    public string ProductName { get; private set; }
    public Money EstimatedValue { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public double UnansweredHours => (DateTime.UtcNow - CreatedAt).TotalHours;
    public LeadStatus Status { get; private set; }
    public LeadUrgency Urgency { get; private set; }
    public string CustomerInquiry { get; private set; }
    public string? AssignedAgentId { get; private set; }
    public string? AssignedAgentName { get; private set; }

    protected LeadEntity() 
    {
        Id = string.Empty;
        CustomerName = string.Empty;
        Phone = string.Empty;
        InstagramHandle = string.Empty;
        Channel = string.Empty;
        ProductName = string.Empty;
        EstimatedValue = new Money(0);
        CustomerInquiry = string.Empty;
    }

    public LeadEntity(
        string id,
        string customerName,
        string phone,
        string instagramHandle,
        string channel,
        string productName,
        Money estimatedValue,
        DateTime createdAt,
        string customerInquiry,
        LeadUrgency urgency = LeadUrgency.Critical)
    {
        Id = id;
        CustomerName = customerName;
        Phone = phone;
        InstagramHandle = instagramHandle;
        Channel = channel;
        ProductName = productName;
        EstimatedValue = estimatedValue;
        CreatedAt = createdAt;
        CustomerInquiry = customerInquiry;
        Urgency = urgency;
        Status = LeadStatus.Unanswered;
        AssignedAgentName = "Taqsimlanmagan (Kutmoqda)";
    }

    public void AssignToAgent(string agentId, string agentName)
    {
        AssignedAgentId = agentId;
        AssignedAgentName = agentName;
        Status = LeadStatus.Reassigned;
    }

    public void MarkAsContacted()
    {
        Status = LeadStatus.Contacted;
    }
}

public class SalesAgentEntity
{
    public string Id { get; private set; }
    public string Name { get; private set; }
    public string Role { get; private set; }
    public string Avatar { get; private set; }
    public ResponseTime ResponseTime { get; private set; }
    public int TotalAssignedLeads { get; private set; }
    public int ClosedDeals { get; private set; }
    public int MissedHotLeads { get; private set; }
    public decimal ConversionRate { get; private set; }
    public decimal PreviousConversionRate { get; private set; }
    public AgentStatus Status { get; private set; }
    public string Diagnosis { get; private set; }

    protected SalesAgentEntity()
    {
        Id = string.Empty;
        Name = string.Empty;
        Role = string.Empty;
        Avatar = string.Empty;
        ResponseTime = new ResponseTime(5);
        Diagnosis = string.Empty;
    }

    public SalesAgentEntity(
        string id,
        string name,
        string role,
        string avatar,
        int avgResponseMinutes,
        int totalLeads,
        int closedDeals,
        int missedLeads,
        decimal conversionRate,
        decimal previousConversionRate,
        AgentStatus status,
        string diagnosis)
    {
        Id = id;
        Name = name;
        Role = role;
        Avatar = avatar;
        ResponseTime = new ResponseTime(avgResponseMinutes);
        TotalAssignedLeads = totalLeads;
        ClosedDeals = closedDeals;
        MissedHotLeads = missedLeads;
        ConversionRate = conversionRate;
        PreviousConversionRate = previousConversionRate;
        Status = status;
        Diagnosis = diagnosis;
    }

    public void ApplySlaWarning()
    {
        Diagnosis += " [SLA Ogohlantirish yuborildi: Kechikkan leadlar avtomatik navbatchiga yo'naltiriladi]";
    }
}

public class ProductEntity
{
    public string Id { get; private set; }
    public string Name { get; private set; }
    public string Sku { get; private set; }
    public string Category { get; private set; }
    public Money Price { get; private set; }
    public decimal CurrentConversionRate { get; private set; }
    public decimal PreviousConversionRate { get; private set; }
    public decimal ConversionDropPercent => PreviousConversionRate > 0 ? Math.Round(((CurrentConversionRate - PreviousConversionRate) / PreviousConversionRate) * 100m, 1) : 0;
    public Money LostRevenue { get; private set; }
    public int ViewsCount { get; private set; }
    public int AddToCartCount { get; private set; }
    public int CheckoutCount { get; private set; }
    public int OrdersCount { get; private set; }
    public bool IsAlerted { get; private set; }
    public string RootCauseNote { get; private set; }

    protected ProductEntity()
    {
        Id = string.Empty;
        Name = string.Empty;
        Sku = string.Empty;
        Category = string.Empty;
        Price = new Money(0);
        LostRevenue = new Money(0);
        RootCauseNote = string.Empty;
    }

    public ProductEntity(
        string id,
        string name,
        string sku,
        string category,
        Money price,
        decimal currentConversion,
        decimal previousConversion,
        Money lostRevenue,
        int views,
        int addToCart,
        int checkout,
        int orders,
        bool isAlerted,
        string rootCauseNote)
    {
        Id = id;
        Name = name;
        Sku = sku;
        Category = category;
        Price = price;
        CurrentConversionRate = currentConversion;
        PreviousConversionRate = previousConversion;
        LostRevenue = lostRevenue;
        ViewsCount = views;
        AddToCartCount = addToCart;
        CheckoutCount = checkout;
        OrdersCount = orders;
        IsAlerted = isAlerted;
        RootCauseNote = rootCauseNote;
    }

    public void ApplyPromoDiscount(int discountPercent)
    {
        RootCauseNote = $"[-{discountPercent}% Promo va Bepul yetkazish faollashtirildi]";
    }
}

public class RootCauseEntity
{
    public string Id { get; private set; }
    public string Category { get; private set; }
    public string Title { get; private set; }
    public SeverityLevel Severity { get; private set; }
    public decimal ImpactPercentage { get; private set; }
    public Money LostRevenue { get; private set; }
    public string Icon { get; private set; }
    public string ShortDescription { get; private set; }
    public string DetailedReason { get; private set; }
    public string KeyMetricBefore { get; private set; }
    public string KeyMetricAfter { get; private set; }
    public string ActionKey { get; private set; }
    public string ActionTitle { get; private set; }
    public bool ActionCompleted { get; set; }

    protected RootCauseEntity()
    {
        Id = string.Empty;
        Category = string.Empty;
        Title = string.Empty;
        LostRevenue = new Money(0);
        Icon = string.Empty;
        ShortDescription = string.Empty;
        DetailedReason = string.Empty;
        KeyMetricBefore = string.Empty;
        KeyMetricAfter = string.Empty;
        ActionKey = string.Empty;
        ActionTitle = string.Empty;
    }

    public RootCauseEntity(
        string id,
        string category,
        string title,
        SeverityLevel severity,
        decimal impactPercentage,
        Money lostRevenue,
        string icon,
        string shortDescription,
        string detailedReason,
        string keyMetricBefore,
        string keyMetricAfter,
        string actionKey,
        string actionTitle)
    {
        Id = id;
        Category = category;
        Title = title;
        Severity = severity;
        ImpactPercentage = impactPercentage;
        LostRevenue = lostRevenue;
        Icon = icon;
        ShortDescription = shortDescription;
        DetailedReason = detailedReason;
        KeyMetricBefore = keyMetricBefore;
        KeyMetricAfter = keyMetricAfter;
        ActionKey = actionKey;
        ActionTitle = actionTitle;
        ActionCompleted = false;
    }
}
