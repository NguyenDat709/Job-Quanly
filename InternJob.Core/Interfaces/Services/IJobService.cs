using InternJob.Core.DTOs.Job;

namespace InternJob.Core.Interfaces.Services;

public interface IJobService
{
    Task<JobResponse> CreateJobAsync(int userId, CreateJobRequest request);
    Task<JobResponse> UpdateJobAsync(int userId, int jobId, UpdateJobRequest request);
    Task CloseJobAsync(int userId, int jobId);
    Task<List<JobResponse>> GetMyJobsAsync(int userId);
}
