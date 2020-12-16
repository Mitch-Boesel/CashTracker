using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CashTrackerApiService.Controllers
{
    [Route("api/ct/monthly")]
    [ApiController]
    public class MonthlyController : ControllerBase
    {

        public readonly PostgresConnection postgresConnection;

        public MonthlyController(PostgresConnection pg)
        {
            postgresConnection = pg;
        }

        // GET: Monthly category spending totals for all categories
        [HttpGet]
        [HttpGet("totals/all/{Month}/{Year}")]
        public string GetMonthlyTotals(string Month, string Year)
        {
            PostgresQuery query = new PgMonthlyTotals(Month, Year, postgresConnection);
            return query.ResultJson;
        }

        // GET: Monthly category breakdown -> number of purchases, money spent, percentage of total
        [HttpGet]
        [HttpGet("breakdown/{Month}/{Year}")]
        public string GetMonthlyBreakdown(string Month, string Year)
        {
            PostgresQuery query = new PgMonthlyBreakdown(Month, Year, postgresConnection);
            return query.ResultJson;
        }

        
        // GET: api/Monthly/
        [HttpGet]
        [HttpGet("purchases/{Category}/{Month}/{Year}")]
        public string GetMonthlyPurchasesSpecific(string Month, string Year, string Category)
        {
            PostgresQuery query = new PgMonthlyPurchasesSpecific(Month, Year, Category, postgresConnection);
            return query.ResultJson;
        }

        [HttpGet]
        [HttpGet("purchases/{Month}/{Year}")]
        public string GetMontlyPurchasesAll(string Month, string Year)
        {
            PostgresQuery query = new PgMonthlyPurchasesAll(Month, Year, postgresConnection);
            return query.ResultJson;
        }

        /*
        // POST: api/Monthly
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Monthly/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }*/
    }
}
