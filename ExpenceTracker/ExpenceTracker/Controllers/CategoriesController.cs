using AutoMapper;
using BLL.Services;
using DAL.Models;
using ExpenceTracker.DTOs.Categories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExpenceTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _categoryService;
        private readonly IMapper _mapper;

        public CategoriesController(CategoryService categoryService, IMapper mapper)
        {
            _categoryService = categoryService;
            _mapper = mapper;
        }

        // Get All Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(_mapper.Map<IEnumerable<CategoryDto>>(categories));
        }

        // Get Category by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            return category != null ? Ok(_mapper.Map<CategoryDto>(category)) : NotFound();
        }

        // Create Category
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var category = _mapper.Map<Category>(dto);
            await _categoryService.AddCategoryAsync(category);
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, _mapper.Map<CategoryDto>(category));
        }

        // Update Category
        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryDto>> UpdateCategory(int id, [FromBody] UpdateCategoryDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null) return NotFound();

            _mapper.Map(dto, category);
            await _categoryService.UpdateCategoryAsync(category);
            return Ok(_mapper.Map<CategoryDto>(category));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            await _categoryService.DeleteCategoryAsync(id);
            return NoContent();
        }
    }
}
