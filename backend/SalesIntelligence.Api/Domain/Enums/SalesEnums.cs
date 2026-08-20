namespace SalesIntelligence.Api.Domain.Enums;

public enum LeadStatus
{
    Unanswered = 0,
    Reassigned = 1,
    Contacted = 2,
    Converted = 3,
    Lost = 4
}

public enum LeadUrgency
{
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}

public enum SeverityLevel
{
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}

public enum AgentStatus
{
    Top = 0,
    Normal = 1,
    Warning = 2,
    Critical = 3
}

public enum CampaignStatus
{
    Active = 0,
    CreativeFatigue = 1,
    HighCpl = 2,
    Inactive = 3
}
