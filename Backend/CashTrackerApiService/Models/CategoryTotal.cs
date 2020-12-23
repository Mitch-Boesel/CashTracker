using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService.Models
{
    public class CategoryTotal
    {
        public double TotalSpent { get; set; }

        public string Category { get; set; }

        public CategoryTotal(double spent, string category)
        {
            TotalSpent = spent;
            Category = category;
        }
    }
}
