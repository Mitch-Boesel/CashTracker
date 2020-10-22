using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace CashTrackerApiService
{
    public class PgMonthlyBreakdown : PostgresQuery
    {
        public Dictionary<string, Tuple<string, string>> MonthEdgeDates { get; }
        public string Month { get; }

        private string Table { get; }
        public PgMonthlyBreakdown(string month, string year, PostgresConnection connection) : base(year)
        {
            Table = connection.Table;
            Month = month;
            MonthEdgeDates = InitMonthEdgeDates();
            ResultJson = ExecuteQuery(connection.ConnectionString);
        }


        private Dictionary<string, Tuple<string, string>> InitMonthEdgeDates()
        {
            Dictionary<string, Tuple<string, string>> edgeDates = new Dictionary<string, Tuple<string, string>>();
            edgeDates.Add("January", new Tuple<string, string>($"01/01/{Year}", $"01/31/{Year}"));
            edgeDates.Add("February", new Tuple<string, string>($"02/01/{Year}", $"02/28/{Year}"));
            edgeDates.Add("March", new Tuple<string, string>($"03/01/{Year}", $"03/31/{Year}"));
            edgeDates.Add("April", new Tuple<string, string>($"04/01/{Year}", $"04/30/{Year}"));
            edgeDates.Add("May", new Tuple<string, string>($"05/01/{Year}", $"05/31/{Year}"));
            edgeDates.Add("June", new Tuple<string, string>($"06/01/{Year}", $"06/30/{Year}"));
            edgeDates.Add("July", new Tuple<string, string>($"07/01/{Year}", $"07/31/{Year}"));
            edgeDates.Add("August", new Tuple<string, string>($"08/01/{Year}", $"08/31/{Year}"));
            edgeDates.Add("September", new Tuple<string, string>($"09/01/{Year}", $"09/30/{Year}"));
            edgeDates.Add("October", new Tuple<string, string>($"10/01/{Year}", $"10/31/{Year}"));
            edgeDates.Add("November", new Tuple<string, string>($"11/01/{Year}", $"11/30/{Year}"));
            edgeDates.Add("December", new Tuple<string, string>($"12/01/{Year}", $"12/31/{Year}"));
            edgeDates.Add("1", new Tuple<string, string>($"01/01/{Year}", $"01/31/{Year}"));
            edgeDates.Add("2", new Tuple<string, string>($"02/01/{Year}", $"02/28/{Year}"));
            edgeDates.Add("3", new Tuple<string, string>($"03/01/{Year}", $"03/31/{Year}"));
            edgeDates.Add("4", new Tuple<string, string>($"04/01/{Year}", $"04/30/{Year}"));
            edgeDates.Add("5", new Tuple<string, string>($"05/01/{Year}", $"05/31/{Year}"));
            edgeDates.Add("6", new Tuple<string, string>($"06/01/{Year}", $"06/30/{Year}"));
            edgeDates.Add("7", new Tuple<string, string>($"07/01/{Year}", $"07/31/{Year}"));
            edgeDates.Add("8", new Tuple<string, string>($"08/01/{Year}", $"08/31/{Year}"));
            edgeDates.Add("9", new Tuple<string, string>($"09/01/{Year}", $"09/30/{Year}"));
            edgeDates.Add("10", new Tuple<string, string>($"10/01/{Year}", $"10/31/{Year}"));
            edgeDates.Add("11", new Tuple<string, string>($"11/01/{Year}", $"11/30/{Year}"));
            edgeDates.Add("12", new Tuple<string, string>($"12/01/{Year}", $"12/31/{Year}"));

            return edgeDates;
        }

        public override string BuildSqlString()
        {
            var sqlString = $"SELECT category, count(category) as count,  sum(price) as total, CAST((sum(price) / spent) * 100 as int) as percentage" +
                $" FROM (SELECT sum(price) as spent" + 
                      $" FROM {Table}" +
                      $" WHERE purchase_date between '{MonthEdgeDates[Month].Item1}' and '{MonthEdgeDates[Month].Item2}'" + 
                      $" ) as temp, {Table}" +
                $" WHERE purchase_date between '{MonthEdgeDates[Month].Item1}' and '{MonthEdgeDates[Month].Item2}'" +
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
