namespace SalesIntelligence.Api.Models;

public record SalesSummaryDto
{
    public decimal CurrentPeriodSales { get; init; }
    public decimal PreviousPeriodSales { get; init; }
    public decimal PercentageChange { get; init; }
    public decimal LostRevenueEstimated { get; init; }
    public int TotalLeadsCurrent { get; init; }
    public int TotalLeadsPrevious { get; init; }
    public decimal LeadChangePercentage { get; init; }
    public decimal OverallConversionCurrent { get; init; }
    public decimal OverallConversionPrevious { get; init; }
    public string PeriodLabel { get; init; } = "So'nggi 30 kun";
    public string AiSummaryText { get; init; } = string.Empty;
    public List<WaterfallItem> WaterfallBreakdown { get; init; } = [];
    public List<DailySalesTrend> DailyTrends { get; init; } = [];
}

public record WaterfallItem(string Cause, decimal ImpactAmount, decimal ImpactPercent, string Category, bool IsNegative);

public record DailySalesTrend(string Date, decimal CurrentSales, decimal PreviousSales, int LeadsCount);

public record RootCauseDto
{
    public string Id { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Severity { get; init; } = "High"; // Critical, High, Medium, Low
    public decimal ImpactPercentage { get; init; }
    public decimal LostRevenue { get; init; }
    public string Icon { get; init; } = string.Empty;
    public string ShortDescription { get; init; } = string.Empty;
    public string DetailedReason { get; init; } = string.Empty;
    public string KeyMetricBefore { get; init; } = string.Empty;
    public string KeyMetricAfter { get; init; } = string.Empty;
    public string ActionKey { get; init; } = string.Empty;
    public string ActionTitle { get; init; } = string.Empty;
    public bool ActionCompleted { get; set; }
}

public record InstagramAnalyticsDto
{
    public int LeadsThisMonth { get; init; }
    public int LeadsLastMonth { get; init; }
    public decimal DropPercentage { get; init; }
    public decimal AdSpendThisMonth { get; init; }
    public decimal AdSpendLastMonth { get; init; }
    public decimal CostPerLeadCurrent { get; init; }
    public decimal CostPerLeadPrevious { get; init; }
    public decimal CtrCurrent { get; init; }
    public decimal CtrPrevious { get; init; }
    public string AiAnalysis { get; init; } = string.Empty;
    public List<AdCampaignDto> Campaigns { get; init; } = [];
    public List<LeadChannelComparison> Channels { get; init; } = [];
}

public record AdCampaignDto(
    string Name,
    string Status,
    decimal Spend,
    int Leads,
    decimal Cpl,
    decimal Ctr,
    string Diagnosis
);

public record LeadChannelComparison(string Channel, int CurrentLeads, int PreviousLeads, decimal ChangePercent);

public record AgentPerformanceDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string Avatar { get; init; } = string.Empty;
    public int AvgResponseTimeMinutes { get; init; }
    public int TargetResponseTimeMinutes { get; init; } = 5;
    public int TotalAssignedLeads { get; init; }
    public int ClosedDeals { get; init; }
    public int MissedHotLeads { get; init; }
    public decimal ConversionRate { get; init; }
    public decimal PreviousConversionRate { get; init; }
    public string Status { get; init; } = "Normal"; // "Critical", "Warning", "Top"
    public string Diagnosis { get; init; } = string.Empty;
}

public record AgentResponseOverviewDto
{
    public int TotalAgents { get; init; }
    public int LaggingAgentsCount { get; init; }
    public int AvgTeamResponseTimeMinutes { get; init; }
    public int TargetResponseTimeMinutes { get; init; }
    public decimal RevenueLostDueToDelay { get; init; }
    public string AiInsight { get; init; } = string.Empty;
    public List<AgentPerformanceDto> Agents { get; init; } = [];
    public List<ResponseTimeSlaBucket> SlaDistribution { get; init; } = [];
}

public record ResponseTimeSlaBucket(string Range, int LeadCount, decimal ConversionRate, bool IsAcceptable);

public record ProductMetricDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Sku { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public decimal CurrentConversionRate { get; init; }
    public decimal PreviousConversionRate { get; init; }
    public decimal ConversionChangePercent { get; init; }
    public decimal LostRevenue { get; init; }
    public int ViewsCount { get; init; }
    public int AddToCartCount { get; init; }
    public int CheckoutCount { get; init; }
    public int OrdersCount { get; init; }
    public bool IsAlerted { get; init; }
    public string RootCauseNote { get; init; } = string.Empty;
}

public record ProductOverviewDto
{
    public string HighlightedProblemProductId { get; init; } = string.Empty;
    public string AiAnalysis { get; init; } = string.Empty;
    public List<ProductMetricDto> Products { get; init; } = [];
    public List<FunnelStep> ProblemProductFunnel { get; init; } = [];
}

public record FunnelStep(string Stage, int Count, decimal ConversionFromPrevious, decimal BenchmarkRate);

public record HotLeadDto
{
    public string Id { get; init; } = string.Empty;
    public string CustomerName { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string InstagramHandle { get; init; } = string.Empty;
    public string Channel { get; init; } = string.Empty;
    public string ProductName { get; init; } = string.Empty;
    public decimal EstimatedValue { get; init; }
    public DateTime CreatedAt { get; init; }
    public double UnansweredHours { get; init; }
    public string Status { get; set; } = "Unanswered"; // Unanswered, Reassigned, Contacted
    public string AssignedAgentId { get; set; } = string.Empty;
    public string AssignedAgentName { get; set; } = string.Empty;
    public string Urgency { get; init; } = "Critical"; // Critical, High, Medium
    public string CustomerInquiry { get; init; } = string.Empty;
}

public record HotLeadsOverviewDto
{
    public int TotalUnansweredCount { get; init; }
    public decimal TotalEstimatedLostValue { get; init; }
    public double AverageWaitTimeHours { get; init; }
    public string AiPrescription { get; init; } = string.Empty;
    public List<HotLeadDto> Leads { get; init; } = [];
}

public record RepeatPurchaseDto
{
    public decimal RepeatRateCurrent { get; init; }
    public decimal RepeatRatePrevious { get; init; }
    public decimal DropPercentage { get; init; }
    public decimal LostLtvRevenue { get; init; }
    public int ChurnedLoyalCustomersCount { get; init; }
    public int InactiveDaysThreshold { get; init; } = 45;
    public string AiDiagnosis { get; init; } = string.Empty;
    public List<CohortDataDto> CohortHistory { get; init; } = [];
    public List<ChurnReasonDto> ChurnReasons { get; init; } = [];
}

public record CohortDataDto(string Month, decimal RetentionRate, int CustomerCount);
public record ChurnReasonDto(string Reason, decimal Percentage, string RecommendedSolution);

public record SimulationRequestDto
{
    public bool ReassignHotLeads { get; init; } = true;
    public int ResponseTimeImprovementMinutes { get; init; } = 25; // reduce response time by X minutes
    public int InstagramBudgetIncreasePercent { get; init; } = 20; // +X% ad spend & creative refresh
    public int ProductXDiscountPercent { get; init; } = 10; // -X% promo or price tweak
    public bool TriggerWinbackCampaign { get; init; } = true;
}

public record SimulationResultDto
{
    public decimal CurrentSales { get; init; }
    public decimal BaselineDeficit { get; init; }
    public decimal ProjectedRecoveredRevenue { get; init; }
    public decimal ProjectedNewTotalSales { get; init; }
    public decimal ProjectedNewPercentageChange { get; init; }
    public List<SimulationBreakdownItem> ImpactBreakdown { get; init; } = [];
    public string AiExecutiveSummary { get; init; } = string.Empty;
}

public record SimulationBreakdownItem(string Lever, decimal RecoveredAmount, string Description);

public record ActionTriggerDto
{
    public string ActionKey { get; init; } = string.Empty;
    public string TargetId { get; init; } = string.Empty;
    public string? Note { get; init; }
}

public record ActionResultDto
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public string ActionKey { get; init; } = string.Empty;
    public DateTime ExecutedAt { get; init; } = DateTime.UtcNow;
    public object? ResultPayload { get; init; }
}
