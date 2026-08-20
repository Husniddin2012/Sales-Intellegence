using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Security.Cryptography;
using System.Text;
using System.Xml.Linq;

namespace SalesIntelligence.Api.Services;

public class NeuralTtsService : INeuralTtsService
{
    private readonly ILogger<NeuralTtsService> _logger;
    private readonly ConcurrentDictionary<string, byte[]> _cache = new();
    private const string TrustedClientToken = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
    private static double _clockSkewSeconds = 0.0;
    private static DateTime _lastSkewSync = DateTime.MinValue;
    private static readonly HttpClient _httpClient = new() { Timeout = TimeSpan.FromSeconds(5) };

    public NeuralTtsService(ILogger<NeuralTtsService> logger)
    {
        _logger = logger;
    }

    private static async Task SyncClockSkewAsync()
    {
        if (DateTime.UtcNow - _lastSkewSync < TimeSpan.FromHours(1)) return;

        try
        {
            using var req = new HttpRequestMessage(HttpMethod.Get, $"https://speech.platform.bing.com/consumer/speech/synthesize/readaheadedge/v1?TrustedClientToken={TrustedClientToken}");
            using var resp = await _httpClient.SendAsync(req);
            if (resp.Headers.Date.HasValue)
            {
                _clockSkewSeconds = (resp.Headers.Date.Value - DateTimeOffset.UtcNow).TotalSeconds;
                _lastSkewSync = DateTime.UtcNow;
            }
        }
        catch
        {
            // Ignore skew sync failure and use system time
        }
    }

    private static string GenerateSecMsGecToken()
    {
        double unixSec = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + _clockSkewSeconds + 11644473600.0;
        long ticks = (long)(unixSec * 10_000_000.0);
        long roundedTicks = ticks - (ticks % 3_000_000_000L);
        string strToHash = $"{roundedTicks}{TrustedClientToken}";
        using var sha256 = SHA256.Create();
        var hashBytes = sha256.ComputeHash(Encoding.ASCII.GetBytes(strToHash));
        return Convert.ToHexString(hashBytes).ToUpperInvariant();
    }

    public async Task<byte[]?> SynthesizeSpeechAsync(string text, string speakerId = "Anora", string lang = "uz", CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(text)) return null;

        await SyncClockSkewAsync();

        var cleanText = PrepareTextForUzbekPhonetics(text, lang);
        var voiceName = GetVoiceName(speakerId, lang);
        var cacheKey = $"{voiceName}:{cleanText}";

        if (_cache.TryGetValue(cacheKey, out var cachedAudio))
        {
            return cachedAudio;
        }

        try
        {
            var audioBytes = await GenerateAudioViaWebSocketAsync(cleanText, voiceName, cancellationToken);
            if (audioBytes != null && audioBytes.Length > 0)
            {
                _cache.TryAdd(cacheKey, audioBytes);
                return audioBytes;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NeuralTTS Error] {ex}");
            _logger.LogError(ex, "Neural TTS generation failed for voice {Voice}", voiceName);
        }

        return null;
    }

    private static string GetVoiceName(string speakerId, string lang)
    {
        if (lang.Equals("ru", StringComparison.OrdinalIgnoreCase))
        {
            return "ru-RU-SvetlanaNeural";
        }
        if (lang.Equals("en", StringComparison.OrdinalIgnoreCase))
        {
            return "en-US-JennyNeural";
        }

        return speakerId switch
        {
            "Madina" => "uz-UZ-MadinaNeural",
            "Rayhona" => "uz-UZ-DilaraNeural",
            "Zarina" => "uz-UZ-MadinaNeural",
            _ => "uz-UZ-MadinaNeural" // Anora flagship studio voice
        };
    }

    private static string PrepareTextForUzbekPhonetics(string text, string lang)
    {
        var clean = text;
        clean = clean.Replace("*", "").Replace("#", "").Replace("`", "").Replace("~", "");

        if (lang.Equals("uz", StringComparison.OrdinalIgnoreCase))
        {
            clean = clean.Replace("-18%", "o'n sakkiz foizga pasayish");
            clean = clean.Replace("-31%", "o'ttiz bir foizga");
            clean = clean.Replace("-28%", "yigirma sakkiz foizga");
            clean = clean.Replace("14.2%", "o'n to'rt butun o'ndan ikki foiz");
            clean = clean.Replace("4.2%", "to'rt butun o'ndan ikki foiz");
            clean = clean.Replace("70.4%", "yetmish butun o'ndan to'rt foiz");
            clean = clean.Replace("22,500,000 so'm", "yigirma ikki yarim million so'm");
            clean = clean.Replace("19,300,000 so'm", "o'n to'qqiz million uch yuz ming so'm");
            clean = clean.Replace("2,625,000 so'm", "ikki million olti yuz yigirma besh ming so'm");
            clean = clean.Replace("2,600,000 so'm", "ikki million olti yuz ming so'm");
            clean = clean.Replace("6,000,000 so'm", "olti million so'm");
            clean = clean.Replace("8,000,000 so'm", "sakkiz million so'm");
            clean = clean.Replace("125,000,000 so'm", "bir yuz yigirma besh million so'm");
            clean = clean.Replace("102,500,000 so'm", "bir yuz ikki yarim million so'm");
            clean = clean.Replace("121,800,000 so'm", "bir yuz yigirma bir million sakkiz yuz ming so'm");
            clean = clean.Replace("37 ta hot lead", "o'ttiz yetti ta juda issiq mijoz murojaatlari");
            clean = clean.Replace("37 ta", "o'ttiz yetti ta");
            clean = clean.Replace("42 min", "qirq ikki daqiqa");
            clean = clean.Replace("5 min", "besh daqiqa");
            clean = clean.Replace("24 soat", "yigirma to'rt soat");
            clean = clean.Replace("Smart Pro X", "Smart Pro Iks");
            clean = clean.Replace("SLA", "xizmat ko'rsatish tezligi normativi");
            clean = clean.Replace("CPL", "bitta mijoz narxi");
            clean = clean.Replace("AI", "sun'iy intellekt");
            clean = clean.Replace("Hot lead", "Issiq mijoz");
        }

        return clean;
    }

    private async Task<byte[]?> GenerateAudioViaWebSocketAsync(string text, string voiceName, CancellationToken ct)
    {
        var connectionId = Guid.NewGuid().ToString("N");
        var secMsGec = GenerateSecMsGecToken();
        var uri = new Uri($"wss://speech.platform.bing.com/consumer/speech/synthesize/readaheadedge/v1?TrustedClientToken={TrustedClientToken}&Sec-MS-GEC={secMsGec}&Sec-MS-GEC-Version=1-130.0.2849.68&ConnectionId={connectionId}");

        using var ws = new ClientWebSocket();
        ws.Options.SetRequestHeader("Pragma", "no-cache");
        ws.Options.SetRequestHeader("Cache-Control", "no-cache");
        ws.Options.SetRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0");
        ws.Options.SetRequestHeader("Origin", "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold");

        using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
        cts.CancelAfter(TimeSpan.FromSeconds(15));

        await ws.ConnectAsync(uri, cts.Token);

        // 1. Send speech.config
        var dateStr = DateTime.UtcNow.ToString("r");
        var configMessage = $"X-Timestamp:{dateStr}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{{\"context\":{{\"synthesis\":{{\"audio\":{{\"metadataoptions\":{{\"sentenceBoundaryEnabled\":\"false\",\"wordBoundaryEnabled\":\"false\"}},\"outputFormat\":\"audio-24khz-48kbitrate-mono-mp3\"}}}}}}}}";
        var configBytes = Encoding.UTF8.GetBytes(configMessage);
        await ws.SendAsync(new ArraySegment<byte>(configBytes), WebSocketMessageType.Text, true, cts.Token);

        // 2. Send ssml request
        var requestId = Guid.NewGuid().ToString("N");
        var lang = voiceName.StartsWith("ru") ? "ru-RU" : voiceName.StartsWith("en") ? "en-US" : "uz-UZ";
        var escapedText = new XElement("t", text).Value;
        var ssml = $"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='{lang}'><voice name='{voiceName}'><prosody pitch='+0Hz' rate='+0%'>{escapedText}</prosody></voice></speak>";
        var ssmlMessage = $"X-RequestId:{requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:{dateStr}Z\r\nPath:ssml\r\n\r\n{ssml}";
        var ssmlBytes = Encoding.UTF8.GetBytes(ssmlMessage);
        await ws.SendAsync(new ArraySegment<byte>(ssmlBytes), WebSocketMessageType.Text, true, cts.Token);

        // 3. Receive Audio stream
        using var audioStream = new MemoryStream();
        var buffer = new byte[8192];

        while (ws.State == WebSocketState.Open && !cts.IsCancellationRequested)
        {
            var result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), cts.Token);

            if (result.MessageType == WebSocketMessageType.Close)
            {
                break;
            }

            if (result.MessageType == WebSocketMessageType.Binary)
            {
                // Binary message format: [2-byte header len] [header ascii] [audio binary]
                if (result.Count > 2)
                {
                    int headerLength = (buffer[0] << 8) | buffer[1];
                    int audioOffset = 2 + headerLength;
                    if (result.Count > audioOffset)
                    {
                        audioStream.Write(buffer, audioOffset, result.Count - audioOffset);
                    }
                }
            }
            else if (result.MessageType == WebSocketMessageType.Text)
            {
                var textMsg = Encoding.UTF8.GetString(buffer, 0, result.Count);
                if (textMsg.Contains("Path:turn.end"))
                {
                    break;
                }
            }
        }

        var resultAudio = audioStream.ToArray();
        return resultAudio.Length > 0 ? resultAudio : null;
    }
}
