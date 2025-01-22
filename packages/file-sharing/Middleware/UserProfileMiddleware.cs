using file_sharing.Models;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;

namespace file_sharing.Middleware
{
  public class UserProfileMiddleware
  {
    private readonly RequestDelegate _next;

    public UserProfileMiddleware(RequestDelegate next)
    {
      _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {

      await _next(context);
    }
  }
}

