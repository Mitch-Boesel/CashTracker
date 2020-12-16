using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace CashTrackerApiService
{
    public class QueryNextPid : PostgresQuery
    {
        private string Table { get;}
        public QueryNextPid(PostgresConnection connection) : base("2020")
        {
            Table = connection.Table;
            ResultJson = ExecuteQuery(connection.ConnectionString);
        }

        public override string BuildSqlString()
        {
            var sqlstr = $"SELECT count(*) FROM {Table}";
            return sqlstr;
        }

        public override string ExtractData(NpgsqlDataReader reader)
        {
            reader.Read();
            return reader.GetValue(0).ToString();
        }
    }
}
