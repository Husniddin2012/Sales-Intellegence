using Microsoft.AspNetCore.Mvc;
using SalesIntelligence.Api.Models;
using SalesIntelligence.Api.Services;

namespace SalesIntelligence.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ISalesIntelligenceService _service;

    public DashboardController(ISalesIntelligenceService service)
    {
        _service = service;
    }

    [HttpGet("overview")]
    [ProducesResponseType(typeof(SalesSummaryDto), StatusCodes.Status200OK)]
    public IActionResult GetOverview()
    {
        return Ok(_service.GetOverview());
    }

    [HttpGet("root-causes")]
    [ProducesResponseType(typeof(List<RootCauseDto>), StatusCodes.Status200OK)]
    public IActionResult GetRootCauses()
    {
        return Ok(_service.GetRootCauses());
    }
}

[ApiController]
[Route("api/[controller]")]
public class DiagnosticsController : ControllerBase
{
    private readonly ISalesIntelligenceService _service;

    public DiagnosticsController(ISalesIntelligenceService service)
    {
        _service = service;
    }

    [HttpGet("instagram")]
    [ProducesResponseType(typeof(InstagramAnalyticsDto), StatusCodes.Status200OK)]
    public IActionResult GetInstagram() => Ok(_service.GetInstagramAnalytics());

    [HttpGet("agents")]
    [ProducesResponseType(typeof(AgentResponseOverviewDto), StatusCodes.Status200OK)]
    public IActionResult GetAgents() => Ok(_service.GetAgentPerformance());

    [HttpGet("product-x")]
    [ProducesResponseType(typeof(ProductOverviewDto), StatusCodes.Status200OK)]
    public IActionResult GetProductX() => Ok(_service.GetProductAnalytics());

    [HttpGet("hot-leads")]
    [ProducesResponseType(typeof(HotLeadsOverviewDto), StatusCodes.Status200OK)]
    public IActionResult GetHotLeads() => Ok(_service.GetHotLeads());

    [HttpGet("retention")]
    [ProducesResponseType(typeof(RepeatPurchaseDto), StatusCodes.Status200OK)]
    public IActionResult GetRetention() => Ok(_service.GetRepeatPurchaseAnalytics());
}

[ApiController]
[Route("api/[controller]")]
public class SimulationController : ControllerBase
{
    private readonly ISalesIntelligenceService _service;

    public SimulationController(ISalesIntelligenceService service)
    {
        _service = service;
    }

    [HttpPost("calculate")]
    [ProducesResponseType(typeof(SimulationResultDto), StatusCodes.Status200OK)]
    public IActionResult Calculate([FromBody] SimulationRequestDto request)
    {
        return Ok(_service.RunSimulation(request));
    }
}

[ApiController]
[Route("api/[controller]")]
public class ActionsController : ControllerBase
{
    private readonly ISalesIntelligenceService _service;

    public ActionsController(ISalesIntelligenceService service)
    {
        _service = service;
    }

    [HttpPost("execute")]
    [ProducesResponseType(typeof(ActionResultDto), StatusCodes.Status200OK)]
    public IActionResult Execute([FromBody] ActionTriggerDto trigger)
    {
        return Ok(_service.ExecuteAction(trigger));
    }

    [HttpPost("reset")]
    public IActionResult Reset()
    {
        _service.ResetData();
        return Ok(new { Success = true, Message = "Barcha ma'lumotlar boshlang'ich holatga qaytarildi." });
    }
}
