using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace CashTrackerApiService
{
    public class PgYearlyBreakdown : PostgresQuery
    {
        Tuple<string, string> Dates { get;}
        private string Table { get; }
        public PgYearlyBreakdown(string year, PostgresConnection connection) : base(year)
        {
            Dates = new Tuple<string, string>($"01/31/{year}", $"12/31/{year}");
            Table = connection.Table;
            ResultJson = ExecuteQuery(connection.ConnectionString);
        }

        public override string BuildSqlString()
        {
            var sqlString = $"SELECT category, count(category) as count,  sum(price) as total, CAST((sum(price) / spent) * 100 as int) as percentage" +
                $" FROM (SELECT sum(price) as spent" +
                      $" FROM {Table}" +
                      $" WHERE purchase_date between '{Dates.Item1}' and '{Dates.Item2}'" +
                      $" ) as temp, {Table}" +
                $" WHERE purchase_date between '{Dates.Item1}' and '{Dates.Item2}'" +
                $" GROUP BY {Table}.category, temp.spent" +
                $" ORDER BY total desc";

            return sqlString;
        }

        public override string ExtractData(NpgsqlDataReader reader)
        {
            Dictionary<string, List<Dictionary<string, string>>> totals = new Dictionary<string, List<Dictionary<string, string>>>();
            totals.Add("data", new List<Dictionary<string, string>>());
            double total = 0.0;
            int frequency = 0;

            while (reader.Read())
            {
                var dict = new Dictionary<string, string>();
                dict.Add("category", reader.GetValue(0).ToString());
                dict.Add("frequency", reader.GetValue(1).ToString());
                dict.Add("spent", reader.GetValue(2).ToString());
                dict.Add("percent", reader.GetValue(3).ToString() + "%");
                totals["data"].Add(dict);

                frequency += reader.GetInt32(1);
                total += Convert.ToDouble(reader.GetValue(2).ToString());
            }

            var finalEntry = new Dictionary<string, string>();
            finalEntry.Add("category", "TOTAL");
            finalEntry.Add("frequency", frequency.ToString());
            finalEntry.Add("spent", total.ToString());
            finalEntry.Add("percent", "100%");
            totals["data"].Add(finalEntry);

            return ToJson(totals);
        }
    }
}
