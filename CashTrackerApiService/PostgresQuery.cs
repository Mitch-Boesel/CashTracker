using CashTrackerApiService.Models;
using Newtonsoft.Json;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService
{
    public class PostgresQuery
    {
        private readonly string _connectionString;

        public PostgresQuery(PostgresConnection pgConnection)
        {
            _connectionString = BuildPsqlConnectionString(pgConnection);
        }
        private string BuildPsqlConnectionString(PostgresConnection pg)
        {
            var connectionString = $"Host={pg.Host};Username={pg.Username};Database={pg.Database};password={pg.Password}";
            return connectionString;
        }

        public string ExecuteQuery(string sqlstr)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                string jsonString = string.Empty;
                connection.Open();
                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = connection;
                    cmd.CommandText = sqlstr;
                    try
                    {
                       var reader = cmd.ExecuteReader();
                       jsonString = ExtractTotals(reader);
                    }
                    catch (NpgsqlException ex)
                    {
                        Console.WriteLine(ex.Message.ToString());
                        Console.WriteLine("SQL Error - " + ex.Message.ToString());
                    }
                    finally
                    {
                        connection.Close();
                    }

                    return jsonString;
                }
            }
        }

 /*       public string ExtractPurchasesFromQuery(NpgsqlDataReader reader)  // this one is fucked right now
        {
            Dictionary<string, Dictionary<string, string>> purchases = new Dictionary<string, Dictionary<string, string>>();
            while (reader.Read())
            {
                purchases.Add(new Purchase(reader.GetInt32(0),
                    (double)reader.GetValue(1),
                    reader.GetDate(2).ToString(),
                    reader.GetString(3),
                    reader.GetString(4),
                    string.Empty));
            }

            return purchases;
        }*/

        private string ExtractTotals(NpgsqlDataReader reader)
        {
            Dictionary<string, Dictionary<string, string>> totals = new Dictionary<string, Dictionary<string, string>>();
            totals.Add("data", new Dictionary<string, string>());
            while (reader.Read())
            {
                totals["data"].Add(reader.GetString(0), reader.GetValue(1).ToString());
            }

            return ToJson(totals);
        }

        private string ToJson(Dictionary<string, Dictionary<string, string>> dictionary)
        {
            string json = JsonConvert.SerializeObject(dictionary, Formatting.Indented);
            return json;
        }
    }
}
