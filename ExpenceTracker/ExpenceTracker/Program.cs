using BLL.Services;
using DAL.Data;
using ExpenceTracker.MappingProfiles;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ExpenseTrackerDbContext>(opt =>
         opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<ExpenseService>();
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(CategoryProfile));
builder.Services.AddAutoMapper(typeof(ExpenseProfile));
builder.Services.AddCors(c =>
{
    c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowOrigin");

app.UseRouting();  


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
app.UseHttpsRedirection();

app.Run();

