using InternJob.Core.Entities;

namespace InternJob.Core.Interfaces.Repositories;

public interface IJobRepository
{
    Task<JobPosting?> GetByIdAsync(int jobId);
    Task<JobPosting?> GetByIdWithDetailsAsync(int jobId);
    Task<List<JobPosting>> GetByEmployerIdAsync(int employerId);
    Task AddAsync(JobPosting job);
    Task SaveChangesAsync();
}