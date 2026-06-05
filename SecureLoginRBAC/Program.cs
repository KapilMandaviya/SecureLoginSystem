using DomainLayer.Data;
using UtilityLayer;

using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SecureLoginRBAC.Authorize;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<AppDbContext>(options =>
   options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(5);
});

builder.Services.RegisterAllServices(); 

builder.Services.AddAuthentication("Cookies").AddCookie("Cookies", options =>
{
    options.LoginPath = "/Login/Login";
    options.AccessDeniedPath = "/Home/Dashboard";
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true; // Essential for sessions to work even if the user doesn’t accept cookies
    options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
});

builder.Services.AddAuthorization();

builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
builder.Services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();


builder.Services.AddHttpContextAccessor();  


var app = builder.Build();



UserContext.Configure(
    app.Services.GetRequiredService<IHttpContextAccessor>());

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseStaticFiles();

app.Use(async (context, next) =>
{
    context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    context.Response.Headers["Pragma"] = "no-cache";
    context.Response.Headers["Expires"] = "-1";
    await next();
});


app.UseRouting();

app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Login}/{id?}");

app.Run();
