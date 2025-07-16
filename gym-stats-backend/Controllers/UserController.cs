using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MongoDB.Driver;
using gym_stats_backend.Models;

// DTO for user profile updates (exclude startDate and role)
public class UserUpdateDto
{
    public string firstName { get; set; } = string.Empty;
    public string lastName { get; set; } = string.Empty;
    public float weight { get; set; }
    public float height { get; set; }
    public List<string> pictureUrls { get; set; } = new();
    public DateTime dateOfBirth { get; set; }
}
public class TrainerIdDto
{
    public string trainerId { get; set; } = string.Empty;
}

namespace gym_stats_backend.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
       private readonly IMongoCollection<User> _users;

       public UserController(IMongoClient client, IConfiguration config)
       {
           var databaseName = config["MongoDB:DatabaseName"];
           var database = client.GetDatabase(databaseName);
           _users = database.GetCollection<User>("users"); // ⚠️ Also fix case if needed
       }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                          ?? User.FindFirstValue("sub");
            if (userId == null)
                return Unauthorized();

            var user = await _users.Find(u => u.id == userId).FirstOrDefaultAsync();
            if (user == null)
                return NotFound();

            return Ok(new
            {
                user.id,
                firstName = user.firstName,
                lastName = user.lastName,
                user.email,
                user.role,
                user.weight,
                user.height,
                user.dateOfBirth,
                user.startDate,
                pictureUrls = user.pictureUrls,
                trainer = user.trainer
            });
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UserUpdateDto updatedUser)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                          ?? User.FindFirstValue("sub");

            if (userId == null) return Unauthorized();

            var update = Builders<User>.Update
                .Set(u => u.firstName, updatedUser.firstName)
                .Set(u => u.lastName, updatedUser.lastName)
                .Set(u => u.weight, updatedUser.weight)
                .Set(u => u.height, updatedUser.height)
                .Set(u => u.pictureUrls, updatedUser.pictureUrls)
                .Set(u => u.dateOfBirth, updatedUser.dateOfBirth.ToString("yyyy-MM-dd"));

            var result = await _users.UpdateOneAsync(u => u.id == userId, update);

            if (result.ModifiedCount == 0) return NotFound();

            return NoContent();
        }

        [Authorize]
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                          ?? User.FindFirstValue("sub");

            if (userId == null) return Unauthorized();

            var result = await _users.DeleteOneAsync(u => u.id == userId);

            if (result.DeletedCount == 0) return NotFound();

            return NoContent();
        }
        [Authorize]
        [HttpPut("set-trainer")]
        public async Task<IActionResult> SetTrainer([FromBody] TrainerIdDto input)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                          ?? User.FindFirstValue("sub");

            if (userId == null) return Unauthorized();

            var trainer = await _users.Find(u => u.id == input.trainerId && u.role == "trainer").FirstOrDefaultAsync();
            if (trainer == null) return NotFound("Trainer not found");

            var trainerInfo = new
            {
                id = trainer.id,
                name = $"{trainer.firstName} {trainer.lastName}".Trim(),
                avatarUrl = trainer.pictureUrls?.FirstOrDefault() ?? "https://i.imgur.com/WPZ8b9k.png"
            };

            var update = Builders<User>.Update.Set("trainer", trainerInfo);

            var result = await _users.UpdateOneAsync(u => u.id == userId, update);
            if (result.ModifiedCount == 0) return NotFound("User not updated");

            return NoContent();
        }
        [Authorize(Roles = "trainer")]
        [HttpGet("trainees")]
        public async Task<IActionResult> GetTraineesForTrainer()
        {
            var trainerId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                           ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                           ?? User.FindFirstValue("sub");

            if (trainerId == null) return Unauthorized();

            var trainees = await _users.Find(u => u.trainer != null && u.trainer.id == trainerId).ToListAsync();

            var result = trainees.Select(t => new
            {
                id = t.id,
                firstName = t.firstName,
                lastName = t.lastName,
                email = t.email,
                avatarUrl = (t.pictureUrls != null && t.pictureUrls.Any(url => !string.IsNullOrWhiteSpace(url)))
                    ? t.pictureUrls.First(url => !string.IsNullOrWhiteSpace(url))
                    : "/assets/default-avatar.png",
                age = t.dateOfBirth == default ? null : (int?)((DateTime.Now - DateTime.Parse(t.dateOfBirth)).TotalDays / 365.25),
                height = t.height
            });

            return Ok(result);
        }
        [Authorize(Roles = "trainer")]
                [HttpPut("remove-trainer/{traineeId}")]
                public async Task<IActionResult> RemoveTrainer(string traineeId)
                {
                    var trainerId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                                   ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                                   ?? User.FindFirstValue("sub");

                    if (trainerId == null) return Unauthorized();

                    var trainee = await _users.Find(u => u.id == traineeId).FirstOrDefaultAsync();
                    if (trainee == null || trainee.trainer == null || trainee.trainer.id != trainerId)
                        return BadRequest("Trainee is not linked to this trainer.");

                    var update = Builders<User>.Update.Set(u => u.trainer, null);
                    var result = await _users.UpdateOneAsync(u => u.id == traineeId, update);

                    if (result.ModifiedCount == 0) return NotFound("Update failed");

                    return NoContent();
                }
    }
}
