
using file_sharing.Models;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;

public interface ICustomService
{
  Task<UserProfile> GetProfile();
}
public class ProfileService : ICustomService
{

  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly HttpContext? current;

  public ProfileService(IHttpContextAccessor httpContextAccessor)
  {
    _httpContextAccessor = httpContextAccessor;
    this.current = httpContextAccessor.HttpContext;
  }
  public async Task<UserProfile> GetProfile()
  {
    var token = current.Request.Headers.Authorization;
    var authToken = token.ToString().Replace("Bearer ", "");

    // Get the issuer's ID, which is in the "iss" claim
    string issuerId = current.User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Issuer ?? "unknown";
    // Get the user's ID, which is in the "sub" claim
    string userId = current.User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "unknown";
    string userEmail = current.User.FindFirst(c => c.Type == ClaimTypes.Email)?.Value ?? "unknown";
    string userName = current.User.FindFirst(c => c.Type == "name")?.Value ?? "unknown";

    // Get the user's profile from {issuer}/profile
    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
    var profileResponse = await client.GetAsync($"{issuerId}userinfo");

    var profile = await profileResponse.Content.ReadAsStringAsync();
    var result = JsonSerializer.Deserialize<UserProfile>(profile);

    return result!;
  }
}
