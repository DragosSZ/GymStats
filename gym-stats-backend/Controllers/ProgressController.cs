using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using gym_stats_backend.Models;

[ApiController]
[Route("api/[controller]")]
public class ProgressController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;

    public ProgressController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetProgress()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var stats = await _mongoDbService.Stats
            .Find(s => s.TraineeId == userId)
            .SortByDescending(s => s.Date)
            .ToListAsync();

        var user = await _mongoDbService.Users
            .Find(u => u.id == userId)
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound("User not found");

        var result = stats.Select(s => new
        {
            id = s.Id?.ToString(),
            date = s.Date,
            weight = s.Weight,
            height = s.Height
        }).ToList();

        return Ok(new
        {
            entries = result,
            pictures = user.pictureUrls
        });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateProgress(string id, [FromBody] StatUploadRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var filter = Builders<Stat>.Filter.Where(s => s.Id == id && s.TraineeId == userId);
        var update = Builders<Stat>.Update
            .Set(s => s.Weight, request.Weight)
            .Set(s => s.Height, request.Height)
            .Set(s => s.Date, DateTime.Now);

        var result = await _mongoDbService.Stats.UpdateOneAsync(filter, update);
        if (result.ModifiedCount == 0)
            return NotFound("Stat not found or unauthorized");

        return Ok(new { message = "Progress updated." });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteProgress(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var result = await _mongoDbService.Stats.DeleteOneAsync(s => s.Id == id && s.TraineeId == userId);

        if (result.DeletedCount == 0)
            return NotFound("Stat not found or unauthorized");

        return Ok(new { message = "Progress deleted." });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UploadProgress([FromBody] StatUploadRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var newStat = new Stat
        {
            Id = ObjectId.GenerateNewId().ToString(),
            TraineeId = userId,
            Date = request.Date == default ? DateTime.UtcNow : request.Date,
            Weight = request.Weight,
            Height = request.Height
        };

        await _mongoDbService.Stats.InsertOneAsync(newStat);

        if (request.PictureUrls != null && request.PictureUrls.Count > 0)
        {
            var update = Builders<User>.Update.PushEach(u => u.pictureUrls, request.PictureUrls);
            await _mongoDbService.Users.UpdateOneAsync(u => u.id == userId, update);
        }

        return Ok(new { message = "Progress updated successfully." });
    }

    public class StatUploadRequest
    {
        public float Weight { get; set; }
        public float Height { get; set; }
        public List<string>? PictureUrls { get; set; }
        public DateTime Date { get; set; }
    }
}