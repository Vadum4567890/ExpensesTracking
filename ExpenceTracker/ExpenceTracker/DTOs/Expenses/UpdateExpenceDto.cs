using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExpenceTracker.DTOs.Expenses
{
    public class UpdateExpenseDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public int CategoryId { get; set; }
    }
}
