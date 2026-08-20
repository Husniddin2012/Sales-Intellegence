using Microsoft.AspNetCore.Mvc;
using SalesIntelligence.Api.Models;
using SalesIntelligence.Api.Services;

namespace SalesIntelligence.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiConsultantController : ControllerBase
{
    private readonly IAiConsultantService _consultantService;
    private readonly INeuralTtsService _ttsService;

    public AiConsultantController(IAiConsultantService consultantService, INeuralTtsService ttsService)
    {
        _consultantService = consultantService;
        _ttsService = ttsService;
    }

    [HttpGet("briefing")]
    [ProducesResponseType(typeof(ExecutiveBriefingResponseDto), StatusCodes.Status200OK)]
    public IActionResult GetBriefing()
    {
        var result = _consultantService.GetExecutiveBriefing();
        return Ok(result);
    }

    [HttpPost("ask")]
    [ProducesResponseType(typeof(AiAskResponseDto), StatusCodes.Status200OK)]
    public IActionResult AskQuestion([FromBody] AiAskRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Question))
        {
            return BadRequest(new { success = false, message = "Savol matni bo'sh bo'lmasligi kerak." });
        }

        var result = _consultantService.AskQuestion(request);
        return Ok(result);
    }

    [HttpPost("speech")]
    [HttpPost("/api/voice/synthesize")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> SynthesizeSpeech([FromBody] SpeechSynthesisRequestDto request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new { success = false, message = "Matn bo'sh bo'lmasligi kerak." });
        }

        var audioBytes = await _ttsService.SynthesizeSpeechAsync(request.Text, request.SpeakerId ?? "Anora", request.Lang ?? "uz", ct);
        if (audioBytes == null || audioBytes.Length == 0)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { success = false, message = "Ovoz generatsiyasi vaqtincha mavjud emas" });
        }

        return File(audioBytes, "audio/mpeg", enableRangeProcessing: true);
    }
}
