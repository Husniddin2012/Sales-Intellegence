namespace SalesIntelligence.Api.Services;

public interface INeuralTtsService
{
    Task<byte[]?> SynthesizeSpeechAsync(string text, string speakerId = "Anora", string lang = "uz", CancellationToken cancellationToken = default);
}
