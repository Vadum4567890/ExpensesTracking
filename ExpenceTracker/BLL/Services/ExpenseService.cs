using ClosedXML.Excel;
using DAL.Data;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ExpenseService
    {
        private readonly ExpenseTrackerDbContext _context;

        public ExpenseService(ExpenseTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Expense>> GetAllExpensesAsync()
        {
            return await _context.Expenses.Include(e => e.Category).ToListAsync();
        }

        public async Task<Expense> GetExpenseByIdAsync(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                throw new KeyNotFoundException($"Expense with id {id} not found."); 
            }
            return expense;
        }

        public async Task AddExpenseAsync(Expense expense)
        {
            if (expense == null)
            {
                throw new ArgumentNullException(nameof(expense), "Expense cannot be null."); 
            }

            await _context.Expenses.AddAsync(expense);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateExpenseAsync(Expense expense)
        {
            if (expense == null)
            {
                throw new ArgumentNullException(nameof(expense), "Expense cannot be null."); 
            }

            _context.Expenses.Update(expense);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteExpenseAsync(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense != null)
            {
                _context.Expenses.Remove(expense);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Expense>> GetExpensesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Expenses
                .Where(e => e.Date >= startDate && e.Date <= endDate)
                .Include(e => e.Category)
                .ToListAsync();
        }

        public async Task<IEnumerable<Expense>> GetExpensesByCategoryIdAsync(int categoryId)
        {
            return await _context.Expenses
                                 .Where(e => e.CategoryId == categoryId)
                                 .Include(e => e.Category) // Include Category to avoid lazy loading
                                 .ToListAsync();
        }

        public async Task<byte[]> GenerateExpenseReportAsync(DateTime startDate, DateTime endDate)
        {
            var expenses = await GetExpensesByDateRangeAsync(startDate, endDate);

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Expense Report");
                var currentRow = 1;

                // Headers
                worksheet.Cell(currentRow, 1).Value = "Date";
                worksheet.Cell(currentRow, 2).Value = "Description";
                worksheet.Cell(currentRow, 3).Value = "Category";
                worksheet.Cell(currentRow, 4).Value = "Amount";

                // Fill Data
                foreach (var expense in expenses)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = expense.Date.ToString("dd.MM.yyyy");
                    worksheet.Cell(currentRow, 2).Value = expense.Description;
                    worksheet.Cell(currentRow, 3).Value = expense.Category.Name;
                    worksheet.Cell(currentRow, 4).Value = expense.Amount;
                }

                // Summary
                var groupedExpenses = expenses.GroupBy(e => e.Category.Name)
                    .Select(g => new
                    {
                        Category = g.Key,
                        TotalAmount = g.Sum(e => e.Amount)
                    });

                currentRow++;
                worksheet.Cell(currentRow, 3).Value = "Category";
                worksheet.Cell(currentRow, 4).Value = "Total Amount";

                foreach (var group in groupedExpenses)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 3).Value = group.Category;
                    worksheet.Cell(currentRow, 4).Value = group.TotalAmount;
                }

                // Save file to memory
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray(); 
                }
            }
        }
    }
}
