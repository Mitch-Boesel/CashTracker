using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace CashTrackerApiService.Queries
{
    public class PgYearlyMonthTotals : PostgresQuery
    {
        private string Table { get; }

        public PgYearlyMonthTotals(PostgresConnection connection, string year) : base(year)
        {
            this.Table = connection.Table;
            ResultJson = ExecuteQuery(connection.ConnectionString);
        }

        public override string BuildSqlString()
        {
            var sqlString = $"SELECT DISTINCT(EXTRACT(MONTH FROM purchase_date)) AS Month, sum(price)" +
                $" FROM {Table}" +
                $" WHERE purchase_date between '01/01/{Year}' and '12/31/{Year}'" +
                $" GROUP BY Month";
            return sqlString;
        }

        public override string ExtractData(NpgsqlDataReader reader)
        {
            /*
            Dictionary<string, string> months = new Dictionary<string, string>();
            months.Add("1", "Jan");
            months.Add("2", "Feb");
            months.Add("3", "Mar");
            months.Add("4", "Apr");
            months.Add("5", "May");
            months.Add("6", "June");
            months.Add("7", "July");
            months.Add("8", "Aug");
            months.Add("9", "Sep");
            months.Add("10", "Oct");
            months.Add("11", "Nov");
            months.Add("12", "Dec");
            */

            Dictionary<string, List<Dictionary<string, string>>> totals = new Dictionary<string, List<Dictionary<string, string>>>();
            totals.Add("data", new List<Dictionary<string, string>>());

            while(reader.Read())
            {
                var dict = new Dictionary<string, string>();
                dict.Add("Month", reader.GetValue(0).ToString());
                dict.Add("Total", reader.GetValue(1).ToString());
                totals["data"].Add(dict);
            }

            return ToJson(totals);
        }
    }
}
