using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CashTrackerApiService.Controllers
{
    [Route("api/CT/")]
    [ApiController]
    public class MonthlyController : ControllerBase
    {

        public readonly PostgresConnection postgresConnection;

        public MonthlyController(PostgresConnection pg)
        {
            postgresConnection = pg;
        }

        // GET: api/Monthly
        [HttpGet]
        [HttpGet("Monthly")]
        public string Get()
        {
            ISqlStringBuilder stringBuilder = new MonthlyTotalsSqlStringBuilder("January", "2020");
            PostgresQuery postgresQuery = new PostgresQuery(postgresConnection);
            string json = postgresQuery.ExecuteQuery(stringBuilder.BuildSqlString());
            return json;
        }

        // GET: api/Monthly/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

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
        }
    }
}
