using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService
{
    public class PostgresConnection
    {
        public string Host { get; set; }
        public string Username { get; set; }

        public string Database { get; set; }

        public string Password { get; set; }

        public string ConnectionString { get; set; }

    }


}
