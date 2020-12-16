using CashTrackerApiService.Models;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService
{
    public class PostNewPurchase : PostgresQuery
    {
        Purchase Purchase { get;}
        PostgresConnection PostgresConnection { get; }

        private string Table { get;}

        public PostNewPurchase(Purchase purchase, PostgresConnection connection) : base("2020")
        {
            Table = connection.Table;
            Purchase = FormatPurchase(purchase);
            PostgresConnection = connection;
            Purchase.Pid = GetNextPid();
            ResultJson = ExecuteQuery(PostgresConnection.ConnectionString);
        }

        public override string BuildSqlString()
        {
            var sqlstring = $"INSERT INTO {Table}(pid,price,purchase_date,category,business)" +
                $" VALUES('{Purchase.Pid}','{Purchase.Price}','{Purchase.PurchaseDate}','{Purchase.Category}','{Purchase.Business}'" +
                ");";

            return sqlstring;
        }

        private int GetNextPid()
        {
            var nextPid = new QueryNextPid(PostgresConnection);
            return Int32.Parse(nextPid.ResultJson) + 1;
        }

        public override string ExtractData(NpgsqlDataReader reader)
        {
            Dictionary<string, Dictionary<string, string>> totals = new Dictionary<string, Dictionary<string, string>>();
            totals.Add("data", new Dictionary<string, string>());

            totals["data"].Add("Business", Purchase.Business);
            totals["data"].Add("Category", Purchase.Category);
            totals["data"].Add("Date", Purchase.PurchaseDate);
            totals["data"].Add("Price", Purchase.Price.ToString());


            return ToJson(totals);
            //return "Call Successful!";
        }

        private Purchase FormatPurchase(Purchase purchase)
        {
            purchase.Category = purchase.Category.Replace("'", "");
            purchase.Business = purchase.Business.Replace("'", "");

            return purchase;
        }

    }
}
