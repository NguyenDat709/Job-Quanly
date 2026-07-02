using InternJob.Core.DTOs.CV;
using Microsoft.AspNetCore.Http;

namespace InternJob.Core.Interfaces.Services;

public interface ICVService
{
    Task<UploadCVResponse> UploadCVAsync(int userId, IFormFile file);
    Task<List<CVResponse>> GetMyCVsAsync(int userId);
}