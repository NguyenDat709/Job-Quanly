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

    public async Task<(List<JobPosting> Items, int Total)> SearchAsync(
        string? keyword,
        string? location,
        int? categoryId,
        int page,
        int pageSize)
    {
        var query = _context.JobPostings
            .Include(j => j.Employer)
            .Include(j => j.Category)
            .Where(j=>j.Status == "Approved" || j.Status=="Pending")
            .Where(j => j.Deadline >= DateTime.UtcNow) 
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(keyword))
            query = query.Where(j =>
                j.Title.Contains(keyword) ||
                j.Description.Contains(keyword));

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(j => j.Location.Contains(location));

        if (categoryId.HasValue)
            query = query.Where(j => j.CategoryId == categoryId.Value);
        
        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(j => j.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, total);
    }
}