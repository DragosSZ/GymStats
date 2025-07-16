using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;
var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var connectionString = builder.Configuration.GetConnectionString("MongoDb");
    return new MongoClient(connectionString);
});
builder.Services.AddSingleton<MongoDbService>();
builder.Services.AddControllers(); // ✅ Required to use controllers
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Gym Stats API",
        Version = "v1",
        Description = "API documentation for the Gym Stats application.",
        Contact = new OpenApiContact
        {
            Name = "Dragos Szilagyi",
            Email = "example@example.com"
        }
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token like this: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is not configured.");
}
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
           {
               ValidateIssuerSigningKey = true,
               IssuerSigningKey = new SymmetricSecurityKey(key),
               ValidateIssuer = true,
               ValidateAudience = true,
               ValidIssuer = "your-app",
               ValidAudience = "your-app",
               ClockSkew = TimeSpan.Zero
           };
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("❌ JWT authentication failed: " + context.Exception.Message);
            Console.WriteLine("🔍 Token that failed: " + context.Request.Headers["Authorization"]);
            Console.WriteLine("🔍 Exception details: " + context.Exception);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("✅ JWT token validated successfully");
            return Task.CompletedTask;
        },
        OnMessageReceived = context =>
        {
            Console.WriteLine("📩 JWT received: " + context.Request.Headers["Authorization"]);
            return Task.CompletedTask;
        }
    };
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

// Add authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// ✅ Required to activate routes in controllers
app.MapControllers();

Console.WriteLine("📡 API routes mapped: /api/auth/login should now be active");

// Development-only test login endpoint
if (app.Environment.IsDevelopment())
{
    app.MapGet("/api/test/login/{role}", (string role) =>
    {
        var claims = new[]
        {
            new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, "test-user-id"),
            new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email, "test@example.com"),
            new System.Security.Claims.Claim("role", role)
        };

        var jwtKey = builder.Configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new InvalidOperationException("JWT Key is not configured.");
        }
        var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtKey));
        var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

        var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
            issuer: "your-app",
            audience: "your-app",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        var tokenString = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);

        return Results.Ok(new
        {
            token = tokenString,
            user = new
            {
                id = "test-user-id",
                email = "test@example.com",
                role = role
            }
        });
    });
}

app.Run();
