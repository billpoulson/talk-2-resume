
using file_sharing.Models;
using StackExchange.Redis;
using System.ComponentModel;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;

public interface ICustomService
{
  Task<UserProfile?> GetProfile();
}
public class ProfileService : ICustomService
{
  private readonly ILogger _logger;
  private readonly IConnectionMultiplexer _redis;
  private readonly HttpContext? _httpContext;
  public ProfileService(
    ILogger<ProfileService> logger,
    IHttpContextAccessor httpContextAccessor,
    IConnectionMultiplexer redis
    )
  {
    this._logger = logger;
    this._redis = redis;
    this._httpContext = httpContextAccessor.HttpContext!;
  }
  public async Task<UserProfile?> GetProfile()
  {
    var token = _httpContext?.Request.Headers.Authorization.ToString();
    if (token == null) { return null; }
    var tokenValue = token.Replace("Bearer ", "");
    // Get the issuer's ID, which is in the "iss" claim
    string? userSub = _httpContext.User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

    if (userSub != null)
    {
      var db = _redis.GetDatabase();
      var value = await db.StringGetAsync(userSub);
      if (value.IsNull)
      {
        string issuerId = _httpContext.User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Issuer!;
        var profile = await this.FetchUserProfile(issuerId, tokenValue);
        if (profile != null)
        {
          var cacheEntry = new CacheEntry<UserProfile>(
            profile,
            new { CreatedByResource = "Share-Service" }
          );
          await db.StringSetAsync(userSub, JsonSerializer.Serialize(cacheEntry), TimeSpan.FromMinutes(2));
          return profile;
        }
      }
      if (value.HasValue)
      {
        var serializedProfile = value.ToString();
        var o = new JsonSerializerOptions
        {
          NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString,
          PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
          PropertyNameCaseInsensitive = true,
        };

        var cachedProfile = JsonSerializer.Deserialize<CacheEntry<UserProfile>>(serializedProfile, o)!;
        return cachedProfile.Data!;
      }
    }

    return null;
  }
  async private Task<UserProfile?> FetchUserProfile(
    string issuerId,
    string authToken
   )
  {
    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
    var requestUrl = $"{issuerId}userinfo";
    var profileResponse = await client.GetAsync(requestUrl);

    if (profileResponse.IsSuccessStatusCode)
    {
      var profile = await profileResponse.Content.ReadAsStringAsync();
      var result = JsonSerializer.Deserialize<UserProfile>(profile)!;
      return result;
    }
    return null;
  }
}
