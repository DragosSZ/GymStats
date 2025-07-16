using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

public class Stat
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("traineeId")]
    public string TraineeId { get; set; }

    [BsonElement("date")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime Date { get; set; }

    [BsonElement("weight")]
    public float Weight { get; set; }

    [BsonElement("height")]
    public float Height { get; set; }
}

public static class StatSeeder
{
    public static async Task SeedAsync(IMongoCollection<Stat> collection)
    {
        var existing = await collection.Find(s => s.TraineeId == "682c33503c79d3df952aeca4").FirstOrDefaultAsync();
        if (existing != null) return;

        var stats = new List<Stat>
        {
            new Stat
            {
                TraineeId = "682c33503c79d3df952aeca4",
                Date = DateTime.Now.AddDays(-2),
                Weight = 80.5f,
                Height = 180.2f
            },
            new Stat
            {
                TraineeId = "682c33503c79d3df952aeca4",
                Date = DateTime.Now.AddDays(-1),
                Weight = 81.0f,
                Height = 180.2f
            }
        };

        await collection.InsertManyAsync(stats);
    }

    public static async Task<List<Stat>> GetStatsForTestUserAsync(IMongoCollection<Stat> collection)
    {
        return await collection.Find(s => s.TraineeId == "682c33503c79d3df952aeca4").ToListAsync();
    }
}