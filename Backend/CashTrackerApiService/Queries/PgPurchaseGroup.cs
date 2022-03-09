using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService
{
    public class PgPurchaseGroup : PostgresQuery
    {
        private string Month { get;}
        private string Categories { get; }
        private string Table { get; }
        private string SqlIn { get; }
        public PgPurchaseGroup(string year, string month, string categories, bool sqlIn, PostgresConnection connection) : base(year)
        {
            Month = month;
            Categories = categories;
            Table = connection.Table;
            SqlIn = sqlIn ? "IN" : "NOT IN";
            ResultJson = ExecuteQuery(connection.ConnectionString);
        }

        public override string BuildSqlString()
        {
            var sqlString = "SELECT SUM(price) as price_ " +
                             $"FROM {Table} " +
                             $"WHERE category {SqlIn} ({Categories}) " +
                             $"AND EXTRACT(MONTH FROM purchase_date) = {Month} " +
                             $"AND EXTRACT(YEAR FROM purchase_date) = {Year};";
            return sqlString;
        }

        public override string ExtractData(NpgsqlDataReader reader)
        {
            reader.Read();
            var value = reader.GetValue(0).ToString();
            return string.IsNullOrWhiteSpace(value) ? "0" : value;
        }
    }
}
