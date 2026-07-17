using InternJob.Core.Entities;
using InternJob.Core.Interfaces.Repositories;
using InternJob.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InternJob.Infrastructure.Repositories;

public class ApplicationRepository : IApplicationRepository
{
    private readonly AppDbContext _context;

    public ApplicationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExistsAsync(int jobId, int candidateId)
    {
        return await _context.Applications
            .AnyAsync(a => a.JobId == jobId && a.CandidateId == candidateId);
    }

    public async Task<List<Application>> GetByCandidateIdAsync(int candidateId)
    {
        return await _context.Applications
            .Include(a => a.Job)
                .ThenInclude(j => j.Employer)
            .Include(a => a.CV)
            .Where(a => a.CandidateId == candidateId)
            .OrderByDescending(a => a.AppliedAt)
            .ToListAsync();
    }
    public async Task<List<Application>> GetAllByEmployerIdAsync(int employerId)
    {
        return await _context.Applications
            .Include(a => a.Job)
            .ThenInclude(j=>j.Employer)         
            .Include(a => a.CV)          // Lấy thông tin CV
            .Where(a => a.Job.EmployerId == employerId)
            .OrderByDescending(a => a.AppliedAt) // Lọc theo Employer
            .ToListAsync();
    }
    public async Task AddAsync(Application application)
    {
        await _context.Applications.AddAsync(application);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<Application?> GetByIdAsync(int applicationId)
    {
        return await _context.Applications
            .FirstOrDefaultAsync(x => x.ApplicationId == applicationId);
    }

    public void Update(Application application)
    {
        _context.Applications.Update(application);
    }

}