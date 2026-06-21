using InternJob.Core.Entities;

namespace InternJob.Core.Interfaces.Repositories;

public interface IEmployerRepository
{
    Task<EmployerProfile?> GetByUserIdAsync(int userId);
}