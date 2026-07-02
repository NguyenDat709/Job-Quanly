using InternJob.Core.DTOs.Application;

namespace InternJob.Core.Interfaces.Services;

public interface IApplicationService
{
    Task<ApplicationResponse> ApplyJobAsync(int userId, int jobId, ApplyJobRequest request);
    Task<List<ApplicationResponse>> GetMyApplicationsAsync(int userId);
}