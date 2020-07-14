using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService
{
    public abstract class MonthlySqlStringBuilder : ISqlStringBuilder
    {
        public  Dictionary<string, Tuple<string, string>> MonthEdgeDates { get;}
        public string Year { get;}
        public string Month { get;}

        public MonthlySqlStringBuilder(string month, string year)
        {
            Month = month;
            Year = year;
            MonthEdgeDates = InitMonthEdgeDates();
        }

        public abstract string BuildSqlString();

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

            return edgeDates;
        }

    }
}
