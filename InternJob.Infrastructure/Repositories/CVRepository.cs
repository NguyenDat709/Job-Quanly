using InternJob.Core.Entities;
using InternJob.Core.Interfaces.Repositories;
using InternJob.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InternJob.Infrastructure.Repositories;

public class CVRepository : ICVRepository
{
    private readonly AppDbContext _context;

    public CVRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CV?> GetByIdAsync(int cvId)
    {
        return await _context.CVs.FirstOrDefaultAsync(c => c.CVId == cvId);
    }

    public async Task<List<CV>> GetByCandidateIdAsync(int candidateId)
    {
        return await _context.CVs
            .Where(c => c.CandidateId == candidateId)
            .OrderByDescending(c => c.UploadedAt)
            .ToListAsync();
    }

    public async Task AddAsync(CV cv)
    {
        await _context.CVs.AddAsync(cv);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public void Update(CV cv)
    {
        _context.Entry(cv).State = EntityState.Modified;
    }
}