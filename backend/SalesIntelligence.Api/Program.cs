using Microsoft.EntityFrameworkCore;
using SalesIntelligence.Api.Data;
using SalesIntelligence.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register EF Core PostgreSQL DbContext
var connectionString = builder.Configuration.GetConnectionString("PostgreSql")
    ?? "Host=localhost;Port=5432;Database=Sales_Intelligence;Username=postgres;Password=postgres";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// Register Singleton DataStore and Services
builder.Services.AddSingleton<SalesDataStore>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddScoped<ISalesIntelligenceService, SalesIntelligenceService>();
builder.Services.AddSingleton<IAuthService, AuthService>();
builder.Services.AddScoped<IAiConsultantService, AiConsultantService>();
builder.Services.AddSingleton<INeuralTtsService, NeuralTtsService>();

// Configure CORS for Frontend Vite Dev Server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sales Intelligence API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");

// Redirect root to Swagger UI so opening localhost directly works
app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseAuthorization();
app.MapControllers();

// Auto-initialize PostgreSQL Database schema & tables
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetService<AppDbContext>();
    if (dbContext != null)
    {
        try
        {
            dbContext.Database.EnsureCreated();
            Console.WriteLine("[PostgreSQL] 'Sales_Intelligence' ma'lumotlar bazasi va jadvallar muvaffaqiyatli ulandi va tekshirildi!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[PostgreSQL Warning] {ex.Message}");
        }
    }
}

app.Run();
