using file_sharing.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Newtonsoft.Json;
using StackExchange.Redis;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.



builder.Services
.AddControllers()
  .AddNewtonsoftJson(options =>
  {
    // Configure Newtonsoft.Json options here
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
  });

builder.Services
  .AddScoped<ICustomService, ProfileService>()
  .AddSingleton<IConnectionMultiplexer>(sp =>
  {
    // Add Redis configuration
    var configuration = Environment.GetEnvironmentVariable("REDIS_CONNECTION_STRING") ?? "redis:6379";
    return ConnectionMultiplexer.Connect(configuration);
  });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
  options.Authority = "https://" + Environment.GetEnvironmentVariable("AUTH_ISSUER");
  options.Audience = Environment.GetEnvironmentVariable("AUTH_AUDIENCE");
  options.RequireHttpsMetadata = false; // Disable HTTPS requirement
});


var app = builder.Build();
app.UseMiddleware<UserProfileMiddleware>();
app.MapGet("/me", (ICustomService customService) => customService.GetProfile());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
  app.UseSwagger();
  app.UseSwaggerUI();
}
else
{
  app.UseExceptionHandler("/Home/Error");
}





//app.UseStaticFiles();

// 2. Enable authentication middleware
app.UseAuthentication();

//app.UseMvc(routes =>
//{
//  routes.MapRoute(
//    name: "default",
//    template: "{controller=Home}/{action=Index}/{id?}");
//});




// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();


































//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Newtonsoft.Json;
//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.

//builder.Services.AddControllers()
//  .AddNewtonsoftJson(options =>
//  {
//    // Configure Newtonsoft.Json options here
//    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
//    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
//  });

//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
////throw new Exception($"{Environment.GetEnvironmentVariable("AUTH_ISSUER")} {Environment.GetEnvironmentVariable("AUTH_AUDIENCE")}");
////Console.WriteLine(Environment.GetEnvironmentVariable("AUTH_ISSUER"));
////Console.WriteLine(Environment.GetEnvironmentVariable("AUTH_AUDIENCE"));

//builder.Services.AddAuthentication(options =>
//{
//  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//}).AddJwtBearer(options =>
//{
//  options.Authority = Environment.GetEnvironmentVariable("AUTH_ISSUER");
//  options.Audience = Environment.GetEnvironmentVariable("AUTH_AUDIENCE");
//});

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//  app.UseDeveloperExceptionPage();
//  app.UseSwagger();
//  app.UseSwaggerUI();
//}
//else
//{
//  app.UseExceptionHandler("/Home/Error");
//}



////app.UseStaticFiles();

//// 2. Enable authentication middleware
//app.UseAuthentication();

////app.UseMvc(routes =>
////{
////  routes.MapRoute(
////    name: "default",
////    template: "{controller=Home}/{action=Index}/{id?}");
////});




//app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();

//app.Run();
