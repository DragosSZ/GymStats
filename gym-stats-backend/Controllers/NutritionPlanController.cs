using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using gym_stats_backend.Models;

namespace gym_stats_backend.Controllers
{
    [ApiController]
    [Route("api/nutrition-plans")]
    public class NutritionPlansController : ControllerBase
    {
        private readonly IMongoCollection<NutritionPlan> _plans;

        public NutritionPlansController(IMongoClient client, IConfiguration config)
        {
            var db = client.GetDatabase(config["MongoDB:DatabaseName"]);
            _plans = db.GetCollection<NutritionPlan>("nutritionPlans");
        }

        public class MealPlan
        {
            public string protein { get; set; } = "";
            public string carbs { get; set; } = "";
            public string fat { get; set; } = "";
        }

        public class NutritionPlanDto
        {
            public string traineeId { get; set; } = "";
            public string? trainerId { get; set; }
            public DateTime startDate { get; set; }
            public List<MealPlan> meals { get; set; } = new();
            public Dictionary<string, string> goals { get; set; } = new();  // NEW
        }

        public class DailyMealLogDto
        {
            public string traineeId { get; set; } = "";
            public string date { get; set; } = ""; // formatted as yyyy-MM-dd
            public List<List<Dictionary<string, string>>> meals { get; set; } = new();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePlan([FromBody] NutritionPlanDto input)
        {
            var newPlan = new NutritionPlan
            {
                traineeId = input.traineeId,
                trainerId = input.trainerId,
                startDate = input.startDate,
                meals = input.meals.Select(m => new Dictionary<string, string>
                {
                    { "protein", m.protein },
                    { "carbs", m.carbs },
                    { "fat", m.fat }
                }).ToList(),
                goals = input.goals // ✅ Add this
            };

            await _plans.InsertOneAsync(newPlan);
            return Ok(new { message = "Nutrition plan saved." });
        }

        [Authorize]
        [HttpGet("for-user/{traineeId}")]
        public async Task<IActionResult> GetPlansForUser(string traineeId)
        {
            var plans = await _plans.Find(p => p.traineeId == traineeId).SortByDescending(p => p.startDate).ToListAsync();

            var result = plans.Select(p => new
            {
                id = p._id.ToString(),
                startDate = p.startDate,
                meals = p.meals,
                goals = p.goals
            });

            return Ok(result);
        }
    }
}