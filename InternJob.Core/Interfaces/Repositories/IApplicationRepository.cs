using InternJob.Core.Entities;

namespace InternJob.Core.Interfaces.Repositories;

public interface IApplicationRepository
{
    Task<bool> ExistsAsync(int jobId, int candidateId);
    Task<List<Application>> GetByCandidateIdAsync(int candidateId);
    Task AddAsync(Application application);
    Task<List<Application>> GetAllByEmployerIdAsync(int employerId);
    Task SaveChangesAsync();
    Task<Application?> GetByIdAsync(int applicationId);

    void Update(Application application);
}