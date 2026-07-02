using InternJob.Core.Entities;
using InternJob.Core.Interfaces.Repositories;
using InternJob.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InternJob.Infrastructure.Repositories;

public class CandidateRepository : ICandidateRepository
{
    private readonly AppDbContext _context;

    public CandidateRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CandidateProfile?> GetByUserIdAsync(int userId)
    {
        return await _context.CandidateProfiles
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }
}