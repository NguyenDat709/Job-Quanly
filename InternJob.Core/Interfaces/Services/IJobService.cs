using InternJob.Core.DTOs;
using InternJob.Core.DTOs.Job;

namespace InternJob.Core.Interfaces.Services;

public interface IJobService
{
    // Job Posting
    Task<JobResponse> CreateJobAsync(int userId, CreateJobRequest request);
    Task<JobResponse> UpdateJobAsync(int userId, int jobId, UpdateJobRequest request);
    Task CloseJobAsync(int userId, int jobId);
    Task<List<JobResponse>> GetMyJobsAsync(int userId);

    // Job Search and Job Detail
    Task<PagedResponse<JobListResponse>> SearchJobsAsync(JobSearchRequest request);
    Task<JobResponse> GetJobDetailAsync(int jobId);
}
