
using file_sharing.Models;
using StackExchange.Redis;
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
  private readonly IConnectionMultiplexer _redis;
  private readonly HttpContext? _current;

  public ProfileService(
    IHttpContextAccessor httpContextAccessor
    //IConnectionMultiplexer redis
    )
  {
    _httpContextAccessor = httpContextAccessor;
    //this._redis = redis;
    this._current = httpContextAccessor.HttpContext;
  }
  public async Task<UserProfile> GetProfile()
  {
    //var db = _redis.GetDatabase();
    //var value = await db.StringGetAsync(key);
    //return Ok(value.ToString());


    var token = _current.Request.Headers.Authorization;
    var authToken = token.ToString().Replace("Bearer ", "");
    var issuer = Environment.GetEnvironmentVariable("AUTH_ISSUER");
    // Get the issuer's ID, which is in the "iss" claim
    string issuerId = _current.User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Issuer ?? "unknown";
    // Get the user's ID, which is in the "sub" claim
    string userId = _current.User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "unknown";
    string userEmail = _current.User.FindFirst(c => c.Type == ClaimTypes.Email)?.Value ?? "unknown";
    string userName = _current.User.FindFirst(c => c.Type == "name")?.Value ?? "unknown";

    // Get the user's profile from {issuer}/profile
    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
    var profileResponse = await client.GetAsync($"{issuerId}userinfo");

    var profile = await profileResponse.Content.ReadAsStringAsync();
    var result = JsonSerializer.Deserialize<UserProfile>(profile);

    return result!;
  }
}
