using AutoMapper;
using BLL.Services;
using DAL.Models;
using ExpenceTracker.DTOs.Expenses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExpenceTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly ExpenseService _expenseService;
        private readonly IMapper _mapper;

        public ExpensesController(ExpenseService expenseService, IMapper mapper)
        {
            _expenseService = expenseService;
            _mapper = mapper;
        }

        // Get Exel document
        [HttpGet("report")]
        public async Task<IActionResult> GetReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var reportData = await _expenseService.GenerateExpenseReportAsync(startDate, endDate);
            return reportData.Length > 0 ? File(reportData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ExpenseReport.xlsx") : NotFound("No expenses found for the given date range.");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpenses()
        {
            var expenses = await _expenseService.GetAllExpensesAsync();
            return Ok(_mapper.Map<IEnumerable<ExpenseDto>>(expenses));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseDto>> GetExpense(int id)
        {
            var expense = await _expenseService.GetExpenseByIdAsync(id);
            return expense != null ? Ok(_mapper.Map<ExpenseDto>(expense)) : NotFound();
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpensesByCategory(int categoryId)
        {
            var expenses = await _expenseService.GetExpensesByCategoryIdAsync(categoryId);

            if (expenses == null || !expenses.Any())
            {
                return NotFound($"No expenses found for category with id {categoryId}.");
            }

            return Ok(_mapper.Map<IEnumerable<ExpenseDto>>(expenses));
        }


        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> CreateExpense([FromBody] CreateExpenseDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var expense = _mapper.Map<Expense>(dto);
            await _expenseService.AddExpenseAsync(expense);
            return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, _mapper.Map<ExpenseDto>(expense));
        }

        // Update Expense
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] UpdateExpenseDto dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch.");

            var expense = await _expenseService.GetExpenseByIdAsync(id);
            if (expense == null) return NotFound();

            _mapper.Map(dto, expense);
            await _expenseService.UpdateExpenseAsync(expense);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _expenseService.GetExpenseByIdAsync(id);
            if (expense == null) return NotFound();

            await _expenseService.DeleteExpenseAsync(id);
            return NoContent();
        }
    }
}
