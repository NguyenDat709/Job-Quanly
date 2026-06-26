using InternJob.Core.Entities;

namespace InternJob.Core.Interfaces.Repositories;

public interface IJobRepository
{
    // Job Posting
    Task<JobPosting?> GetByIdAsync(int jobId);
    Task<JobPosting?> GetByIdWithDetailsAsync(int jobId);
    Task<List<JobPosting>> GetByEmployerIdAsync(int employerId);
    Task AddAsync(JobPosting job);
    Task SaveChangesAsync();

    // Job Search
    Task<(List<JobPosting> Items, int Total)> SearchAsync(
        string? keyword,
        string? location,
        int? categoryId,
        int page,
        int pageSize);
}