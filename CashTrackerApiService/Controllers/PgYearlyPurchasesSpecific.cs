using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService.Controllers
{
    public class PgYearlyPurchasesSpecific : PostgresQuery
    {
        public string Category { get; set; }

        public PgYearlyPurchasesSpecific( string year, string category, PostgresConnection connection) : base(year)
        {
            Category = category;
            ResultJson = ExecuteQuery(BuildPsqlConnectionString(connection));
        }

        public override string BuildSqlString()
        {
            var sqlString = $"SELECT *" +
                $" FROM purchase" +
                $" WHERE category = '{Category}' and purchase_date between '01/01/{Year}' and '12/31/{Year}'" +
                $" ORDER BY purchase_date";

            return sqlString;
        }

        public override string ExtractData(NpgsqlDataReader reader)
        {
            Dictionary<string, Dictionary<string, Dictionary<string, string>>> totals = new Dictionary<string, Dictionary<string, Dictionary<string, string>>>();
            totals.Add("data", new Dictionary<string, Dictionary<string, string>>());
            var i = 0;

            while (reader.Read())
            {
                totals["data"].Add(i.ToString(), new Dictionary<string, string>());
                totals["data"][i.ToString()].Add("price", reader.GetValue(1).ToString());
                totals["data"][i.ToString()].Add("date", reader.GetDate(2).ToString());
                totals["data"][i.ToString()].Add("category", reader.GetString(3));
                totals["data"][i.ToString()].Add("business", reader.GetString(4));
                i++;
            }

            return ToJson(totals);
        }
    }
}
