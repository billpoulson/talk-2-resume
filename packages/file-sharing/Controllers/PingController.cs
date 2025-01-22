using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace file_sharing.Controllers
{
  [ApiController]
  [Authorize]
  [Route("[controller]")]
  public class PingController : ControllerBase
  {
    private readonly ILogger<PingController> _logger;

    public PingController(ILogger<PingController> logger)
    {
      _logger = logger;
    }

    [HttpGet(Name = "Ping")]
    public IActionResult Get()
    {
      _logger.LogInformation("Ping Recieved");
      return Ok("PONG");
    }
  }
}
