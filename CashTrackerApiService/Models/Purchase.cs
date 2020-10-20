using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashTrackerApiService.Models
{
    public class Purchase
    {
        public int Pid { get; set; }

        public double Price { get; set; }

        public string PurchaseDate { get; set; }

        public string Category { get; set; }

        public string Business { get; set; }

        public string Notes { get; set; }

        //public Purchase(int pid, double price, string purchaseDate, string category, string business, string notes)
        //{
        //    Pid = pid;
        //    Price = price;
        //    PurchaseDate = purchaseDate;
        //    Category = category;
        //    Business = business;
        //    Notes = notes;
        //}

        public Purchase(double price, string purchaseData, string category, string business, string notes="")
        {
            Pid = -1;
            Price = price;
            PurchaseDate = purchaseData;
            Category = category;
            Business = business;
            Notes = notes;
        }
    }
}
