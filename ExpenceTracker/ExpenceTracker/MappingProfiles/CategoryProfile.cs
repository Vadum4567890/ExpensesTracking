using AutoMapper;
using DAL.Models;
using ExpenceTracker.DTOs.Categories;

namespace ExpenceTracker.MappingProfiles
{ 
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();
            CreateMap<Category, CategoryDto>();
        }
    }
}
