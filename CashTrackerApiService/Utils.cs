using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService
{
    public class Utils
    {
        public static string BuildPsqlConnectionString(PostgresConnection pg)
        {
            var connectionString = $"Host={pg.Host};Username={pg.Username};Database={pg.Database};password={pg.Password}";
            return connectionString;
        }
    }
}
