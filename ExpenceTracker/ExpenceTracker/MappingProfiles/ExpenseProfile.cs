using AutoMapper;
using DAL.Models;
using ExpenceTracker.DTOs.Categories;
using ExpenceTracker.DTOs.Expenses;
using System.Globalization;

namespace ExpenceTracker.MappingProfiles
{
    public class ExpenseProfile : Profile
    {
        public ExpenseProfile()
        {
            CreateMap<UpdateExpenseDto, Expense>();
            CreateMap<Expense, ExpenseDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));
            CreateMap<CreateExpenseDto, Expense>()
            //.ForMember(dest => dest.Date,
            //            opt => opt.MapFrom(src => DateTime.ParseExact(src.Date, "dd.MM.yyyy", CultureInfo.InvariantCulture)))
           .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.Parse(src.Date)));
        }
    }
}
