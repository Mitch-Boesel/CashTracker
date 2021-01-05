using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CashTrackerApiService.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace CashTrackerApiService.Controllers
{
    [Route("api/ct/newpurchase")]
    [ApiController]
    //[EnableCors]
    public class PostPurchaseController : ControllerBase
    {

        public readonly PostgresConnection PostgresConnection;
        public readonly ILogger<PostPurchaseController> Logger;

        public PostPurchaseController(ILogger<PostPurchaseController> logger, PostgresConnection pg)
        {
            PostgresConnection = pg;
            Logger = logger;
        }

        [HttpGet]
        [HttpGet("categories")]
        public string GetCategories()
        {
            PostgresQuery query = new PgGetCategories(PostgresConnection);
            return query.ResultJson;

            //Dictionary<string, List<string>> test = new Dictionary<string, List<string>>();
            //test.Add("data", new List<string>());
            //test["data"].Add("LetsGooo");

            //return JsonConvert.SerializeObject(test, Formatting.Indented);
        }

        [HttpPost]
        [HttpPost("data")]
        //[EnableCors("*")]
        public string Post([FromBody]JObject data)
        {
            var d = data.ToString();
            try
            {
                var newPurchase = JsonConvert.DeserializeObject<Purchase>(d);
                var query = new PostNewPurchase(newPurchase, PostgresConnection);
                if (query.ResultJson == "SQl Error, Request Failed!")
                {
                    Logger.LogWarning("POST new purchase UNSUCCESSFUL");
                    return "Purchase Save Was UNSUCCESSFUL";
                }
                Logger.LogWarning("POST new purchase SUCCESSFUL");
                return "Purchase Successfully Saved!";
            }
            catch (Exception e)
            {
                Logger.LogWarning(e.Message);
                Logger.LogWarning("POST new purchase UNSUCCESSFUL");
                return "Purchase Save Was UNSUCCESSFUL";
            }
        }

        //// GET: api/PostPurchase/5
        //[HttpGet("{id}", Name = "Get")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST: api/PostPurchase
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        //// PUT: api/PostPurchase/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE: api/ApiWithActions/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}