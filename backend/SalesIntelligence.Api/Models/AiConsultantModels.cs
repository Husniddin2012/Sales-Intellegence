namespace SalesIntelligence.Api.Models;

public record BriefingStepDto(
    int StepNumber,
    string Id,
    string Title,
    string NarrationText,
    string DisplayText,
    string KeyStat,
    string Category,
    decimal ImpactAmount,
    string RecommendedAction
);

public record ExecutiveBriefingResponseDto(
    string SummaryTitle,
    int TotalEstimatedMinutes,
    decimal TotalLostRevenue,
    List<BriefingStepDto> Steps,
    string Conclusion
);

public record AiAskRequestDto(
    string Question,
    string? VoiceSpeaker = "Malika",
    string? ContextPage = "overview"
);

public record AiAskResponseDto(
    bool Success,
    string AnswerText,
    string VoiceScriptText,
    List<string> SuggestedFollowUps,
    string? RelatedMetric = null
);

public class SpeechSynthesisRequestDto
{
    public string Text { get; set; } = string.Empty;
    public string? SpeakerId { get; set; } = "Anora";
    public string? Lang { get; set; } = "uz";
}
