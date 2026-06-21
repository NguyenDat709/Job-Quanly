using InternJob.Core.Interfaces.Repositories;
using InternJob.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InternJob.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExistsAsync(int categoryId)
    {
        return await _context.JobCategories
            .AnyAsync(c => c.CategoryId == categoryId);
    }
}