using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CashTrackerApiService.Controllers
{
    [Route("api/CT/Yearly")]
    [ApiController]
    public class YearlyController : ControllerBase
    {
        public readonly PostgresConnection postgresConnection;

        public YearlyController(PostgresConnection pg)
        {
            postgresConnection = pg;
        }
        // GET: api/Yearly/5
        [HttpGet]
        [HttpGet("Totals/{Year}")]
        public string Get(string Year)
        {
            PostgresQuery query = new PgYearlyTotalsAll(Year, postgresConnection);
            return query.ResultJson;
        }

        [HttpGet]
        [HttpGet("Purchases/{Category}/{Year}")]
        public string Get(string Category, string Year)
        {
            PostgresQuery query = new PgYearlyPurchasesSpecific(Year, Category, postgresConnection);
            return query.ResultJson;
        }

        /*
        // POST: api/Yearly
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Yearly/5
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
