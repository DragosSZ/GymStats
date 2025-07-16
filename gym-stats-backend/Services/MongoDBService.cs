using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using gym_stats_backend.Models;

public class MongoDbService
{
    private readonly IMongoDatabase _database;

    public MongoDbService(IConfiguration config)
    {
        try
        {
           var connectionString = config.GetConnectionString("MongoDb");
            var databaseName = config["MongoDB:DatabaseName"];

            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);

            Console.WriteLine("✅ MongoDB connected successfully to database: " + databaseName);
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ Failed to connect to MongoDB: " + ex.Message);
            throw; // optional: rethrow to crash the app if DB is required
        }
    }

    public IMongoCollection<User> GetUsersCollection()
    {
        return _database.GetCollection<User>("users");
    }

    public IMongoCollection<Stat> GetStatsCollection()
    {
        return _database.GetCollection<Stat>("stats");
    }
    public IMongoCollection<User> Users => _database.GetCollection<User>("users");
    public IMongoCollection<Stat> Stats => _database.GetCollection<Stat>("stats");

    // Optional: add more collections here later (e.g., workoutPlans, nutritionPlans, etc.)
}