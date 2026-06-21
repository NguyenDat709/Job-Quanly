using InternJob.Core.Entities;
using InternJob.Core.Interfaces.Repositories;
using InternJob.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InternJob.Infrastructure.Repositories;

public class JobRepository : IJobRepository
{
    private readonly AppDbContext _context;

    public JobRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<JobPosting?> GetByIdAsync(int jobId)
    {
        return await _context.JobPostings
            .FirstOrDefaultAsync(j => j.JobId == jobId);
    }

    public async Task<JobPosting?> GetByIdWithDetailsAsync(int jobId)
    {
        return await _context.JobPostings
            .Include(j => j.Employer)
            .Include(j => j.Category)
            .FirstOrDefaultAsync(j => j.JobId == jobId);
    }

    public async Task<List<JobPosting>> GetByEmployerIdAsync(int employerId)
    {
        return await _context.JobPostings
            .Include(j => j.Employer)
            .Include(j => j.Category)
            .Where(j => j.EmployerId == employerId)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(JobPosting job)
    {
        await _context.JobPostings.AddAsync(job);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}