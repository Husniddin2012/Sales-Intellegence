using SalesIntelligence.Api.Models;

namespace SalesIntelligence.Api.Services;

public interface IAiConsultantService
{
    ExecutiveBriefingResponseDto GetExecutiveBriefing();
    AiAskResponseDto AskQuestion(AiAskRequestDto request);
}
