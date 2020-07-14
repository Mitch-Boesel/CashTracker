using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService
{
    interface ISqlStringBuilder
    {
        string Year { get; }


        string BuildSqlString();
    }
}
