using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService
{
    public class MonthlyTotalsSqlStringBuilder : MonthlySqlStringBuilder
    {
        public MonthlyTotalsSqlStringBuilder(string month, string year) : base(month, year) { }

        public override string BuildSqlString()
        {
            var sqlString = $"SELECT category, sum(price) as total" +
                $" FROM purchase" +
                $" WHERE purchase_date between '{MonthEdgeDates[Month].Item1}' and '{MonthEdgeDates[Month].Item2}'" +
                $" GROUP BY category" +
                $" ORDER BY total desc";

            return sqlString;
        }
    }
}
