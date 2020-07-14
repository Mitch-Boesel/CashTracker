using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService.Controllers
{
    public class PgYearlyTotalsAll : PostgresQuery
    {
        public PgYearlyTotalsAll(string year, PostgresConnection connection) : base(year)
        {
            ResultJson = ExecuteQuery(BuildPsqlConnectionString(connection));
        }

        public override string BuildSqlString()
        {
            var sqlString = $"SELECT category, sum(price) as total" +
                $" FROM purchase" +
                $" WHERE purchase_date between '01/01/{Year}' and '12/31/{Year}'" +
                $" GROUP BY category" +
                $" ORDER BY total desc";

            return sqlString;
        }

        public override string ExtractData(NpgsqlDataReader reader)
        {
            Dictionary<string, Dictionary<string, string>> totals = new Dictionary<string, Dictionary<string, string>>();
            totals.Add("data", new Dictionary<string, string>());
            while (reader.Read())
            {
                totals["data"].Add(reader.GetString(0), reader.GetValue(1).ToString());
            }

            return ToJson(totals);
        }
    }
}
