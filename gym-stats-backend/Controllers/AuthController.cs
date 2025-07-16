using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using BCrypt.Net;
using gym_stats_backend.Models;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;
    private readonly IConfiguration _configuration;

    public AuthController(MongoDbService mongoDbService, IConfiguration configuration)
    {
        _mongoDbService = mongoDbService;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        Console.WriteLine("⚡️ Login endpoint was hit");
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        if (request == null)
        {
            Console.WriteLine("❌ Request is null");
            return BadRequest("Request body is missing");
        }

        Console.WriteLine($"📩 Email: {request.email}");
        Console.WriteLine($"🔑 Password: {request.password}");

        try
        {
            var user = await _mongoDbService.Users.Find(u => u.email == request.email).FirstOrDefaultAsync();
            Console.WriteLine($"⏱️ [Step] MongoDB query: {stopwatch.ElapsedMilliseconds} ms");

            if (user == null)
            {
                Console.WriteLine("❌ No user found with that email");
                return Unauthorized("Invalid email or password");
            }

            Console.WriteLine($"✅ DB Match: {user.email} / {user.password} / {user.role}");

            if (!BCrypt.Net.BCrypt.Verify(request.password, user.password))
            {
                Console.WriteLine($"⏱️ [Step] Password verification: {stopwatch.ElapsedMilliseconds} ms");
                Console.WriteLine("❌ Password does not match");
                return Unauthorized("Invalid email or password");
            }

            Console.WriteLine("✅ Login successful");
            Console.WriteLine($"⏱️ [Step] Claims and preparation: {stopwatch.ElapsedMilliseconds} ms");
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.id),
                new Claim(JwtRegisteredClaimNames.Email, user.email),
                new Claim(ClaimTypes.Role, user.role)
            };

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT Key is not configured.");
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "your-app",
                audience: "your-app",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            Console.WriteLine($"⏱️ [Step] Token generation: {stopwatch.ElapsedMilliseconds} ms");

            stopwatch.Stop();
            Console.WriteLine($"✅ Total login processing time: {stopwatch.ElapsedMilliseconds} ms");
            return Ok(new
            {
                token = tokenString,
                user = new
                {
                    user.id,
                    user.email,
                    user.role
                }
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ EXCEPTION: " + ex.Message);
            return StatusCode(500, "Internal error");
        }
    }
    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request)
    {
        var existing = await _mongoDbService.Users.Find(u => u.email == request.email).FirstOrDefaultAsync();
        if (existing != null)
        {
            return BadRequest(new { message = "User with this email already exists." });
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.password);

        var user = new User
        {
            firstName = request.firstName,
            lastName = request.lastName,
            email = request.email,
            password = hashedPassword,
            role = request.role,
            stats = new List<Stat>(),
            pictureUrls = new List<string>()
        };

        await _mongoDbService.Users.InsertOneAsync(user);

        return Ok(new { message = "User created successfully." });
    }
}