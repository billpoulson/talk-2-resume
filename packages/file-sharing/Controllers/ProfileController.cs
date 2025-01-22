using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;
using file_sharing.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
namespace file_sharing.Controllers
{

  [ApiController]
  [Authorize]
  [Route("[controller]")]
  public class ProfileController : ControllerBase
  {
    private readonly ICustomService svc;

    public ProfileController(ICustomService svc)
    {
      this.svc = svc;
    }

    [HttpGet]
    async public Task<IActionResult> GetProfile()
    {
      var result = await this.svc.GetProfile();
      return Ok(result);
    }

  }
}

