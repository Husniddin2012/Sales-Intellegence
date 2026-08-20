namespace SalesIntelligence.Api.Domain.Events;

public record HotLeadsReassignedDomainEvent(int LeadsCount, List<string> AssignedAgentNames, DateTime Timestamp);

public record SlaBreachAlertedDomainEvent(List<string> AgentNames, DateTime Timestamp);

public record ProductPromoActivatedDomainEvent(string ProductId, int DiscountPercentage, DateTime Timestamp);
