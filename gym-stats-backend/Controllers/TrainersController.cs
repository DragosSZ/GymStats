using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using gym_stats_backend.Models;

namespace gym_stats_backend.Controllers
{
    [ApiController]
    [Route("api/trainers")]
    public class TrainersController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;

        public TrainersController(IMongoClient client, IConfiguration config)
        {
            var databaseName = config["MongoDB:DatabaseName"];
            var database = client.GetDatabase(databaseName);
            _usersCollection = database.GetCollection<User>("users");
        }

        [HttpGet]
        public async Task<IActionResult> GetTrainers()
        {
            var trainers = await _usersCollection
                .Find(u => u.role == "trainer")
                .ToListAsync();

            // Project only necessary fields for frontend
            var result = trainers.Select(t => new
            {
                id = t.id,
                name = $"{t.firstName} {t.lastName}".Trim(),
                photo = (t.pictureUrls != null && t.pictureUrls.Any(url => !string.IsNullOrWhiteSpace(url)))
                    ? t.pictureUrls.First(url => !string.IsNullOrWhiteSpace(url))
                    : "src/assets/default-avatar.png"
            });

            return Ok(result);
        }
    }
}