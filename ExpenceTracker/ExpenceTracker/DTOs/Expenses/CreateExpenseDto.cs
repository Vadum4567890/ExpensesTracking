using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExpenceTracker.DTOs.Expenses
{
    public class CreateExpenseDto
    {
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public int CategoryId { get; set; }
    }
}
