using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace CashTrackerApiService
{
    public class PgGetCategories : PostgresQuery
    {
        private string Table { get; }
        public PgGetCategories(PostgresConnection connection) : base("2020")
        {
            Table = connection.Table;
            ResultJson = ExecuteQuery(connection.ConnectionString);
        }

        public override string BuildSqlString()
        {
            var sqlString = $"SELECT distinct(Category) FROM {Table}";
            return sqlString;
        }

        public override string ExtractData(NpgsqlDataReader reader)
        {
            Dictionary<string, List<string>> categories = new Dictionary<string, List<string>>();
            categories.Add("data", new List<string>());

            while(reader.Read())
            {
                categories["data"].Add(reader.GetValue(0).ToString());
            }

            return ToJson(categories);
        }

    }
}
