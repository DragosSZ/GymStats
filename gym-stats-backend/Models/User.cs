using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace gym_stats_backend.Models
{

[BsonIgnoreExtraElements]
public class Trainer
                         {
                             public string id { get; set; }
                             public string name { get; set; }
                             public string avatarUrl { get; set; }
                         }
public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string id { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public string email { get; set; } // optional
    public string role { get; set; }
    public string password { get; set; }
    public string name { get; set; }
    public double weight { get; set; }
    public double height { get; set; }
    public string dateOfBirth { get; set; }
    public string startDate { get; set; }
    public string avatarUrl { get; set; }
    public Trainer trainer { get; set; } // Create a Trainer class if needed

    public List<Stat> stats { get; set; }
    public List<string> pictureUrls { get; set; } = new();
}


}
