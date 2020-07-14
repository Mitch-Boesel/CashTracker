using Newtonsoft.Json;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService
{
    public abstract class PostgresQuery
    {
        public string Year { get; }
        public string ResultJson { get; set; }

        public PostgresQuery(string year)
        {
            Year = year;
        }
        protected string BuildPsqlConnectionString(PostgresConnection pg)
        {
            var connectionString = $"Host={pg.Host};Username={pg.Username};Database={pg.Database};password={pg.Password}";
            return connectionString;
        }

        public string ExecuteQuery(string connectionStr)
        {
            var sqlstr = BuildSqlString();
            using (var connection = new NpgsqlConnection(connectionStr))
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
                        jsonString = ExtractData(reader);
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

        public abstract string BuildSqlString();

        /// <summary>
        /// Should use ToJson() method
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        public abstract string ExtractData(NpgsqlDataReader reader);

        public string ToJson(object dictionary)
        {
            string json = JsonConvert.SerializeObject(dictionary, Formatting.Indented);
            return json;
        }

        /*
        private string ToJson(Dictionary<string, Dictionary<string, string>> dictionary)
        {
            string json = JsonConvert.SerializeObject(dictionary, Formatting.Indented);
            return json;
        }
         */
    }
}
