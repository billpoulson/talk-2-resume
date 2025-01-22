
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
      var token = HttpContext.Request.Headers["Authorization"];
      var authToken = token.ToString().Replace("Bearer ", "");

      // Get the issuer's ID, which is in the "iss" claim
      string issuerId = User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Issuer ?? "unknown";
      // Get the user's ID, which is in the "sub" claim
      string userId = User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "unknown";
      string userEmail = User.FindFirst(c => c.Type == ClaimTypes.Email)?.Value ?? "unknown";
      string userName = User.FindFirst(c => c.Type == "name")?.Value ?? "unknown";

      // Get the user's profile from {issuer}/profile
      var client = new HttpClient();
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
      var profileResponse = await client.GetAsync($"{issuerId}userinfo");

      var profile = await profileResponse.Content.ReadAsStringAsync();
      var result = JsonSerializer.Deserialize<UserProfile>(profile);

      return Ok(new
      {
        UserId = userId,
        Email = userEmail,
        Name = userName,
        Profile = await this.svc.GetProfile()
      });
    }

  }
}

