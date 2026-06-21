using InternJob.Core.Entities;

namespace InternJob.Core.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<bool> ExistsAsync(int categoryId);
}