using InternJob.Core.Entities;

namespace InternJob.Core.Interfaces.Repositories;

public interface ICVRepository
{
    Task<CV?> GetByIdAsync(int cvId);
    Task<List<CV>> GetByCandidateIdAsync(int candidateId);
    Task AddAsync(CV cv);
    void Update(CV cv);
    Task SaveChangesAsync();
}