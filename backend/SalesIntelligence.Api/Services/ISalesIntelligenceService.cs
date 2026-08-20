using SalesIntelligence.Api.Models;

namespace SalesIntelligence.Api.Services;

public interface ISalesIntelligenceService
{
    SalesSummaryDto GetOverview();
    List<RootCauseDto> GetRootCauses();
    InstagramAnalyticsDto GetInstagramAnalytics();
    AgentResponseOverviewDto GetAgentPerformance();
    ProductOverviewDto GetProductAnalytics();
    HotLeadsOverviewDto GetHotLeads();
    RepeatPurchaseDto GetRepeatPurchaseAnalytics();
    SimulationResultDto RunSimulation(SimulationRequestDto request);
    ActionResultDto ExecuteAction(ActionTriggerDto trigger);
    void ResetData();
}
