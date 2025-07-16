using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace gym_stats_backend.Models
{
    public class NutritionPlan
    {
        public ObjectId _id { get; set; }
        public string traineeId { get; set; } = "";
        public string? trainerId { get; set; }
        public DateTime startDate { get; set; }
        public List<Dictionary<string, string>> meals { get; set; } = new();

        // NEW: Meal goals
        public Dictionary<string, string> goals { get; set; } = new();
    }
}