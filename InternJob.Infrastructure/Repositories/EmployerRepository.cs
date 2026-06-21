using InternJob.Core.Entities;
using InternJob.Core.Interfaces.Repositories;
using InternJob.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InternJob.Infrastructure.Repositories;

public class EmployerRepository : IEmployerRepository
{
    private readonly AppDbContext _context;

    public EmployerRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<EmployerProfile?> GetByUserIdAsync(int userId)
    {
        return await _context.EmployerProfiles
            .FirstOrDefaultAsync(e => e.UserId == userId);
    }
}