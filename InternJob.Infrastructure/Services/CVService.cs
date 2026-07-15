using InternJob.Core.DTOs.CV;
using InternJob.Core.Entities;
using InternJob.Core.Interfaces.Repositories;
using InternJob.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http;
namespace InternJob.Infrastructure.Services;

public class CVService : ICVService
{
    private readonly ICVRepository _cvRepository;
    private readonly ICandidateRepository _candidateRepository;
    private readonly string _uploadPath;
    public CVService(ICVRepository cvRepository, ICandidateRepository candidateRepository)
    {
        _cvRepository = cvRepository;
        _candidateRepository = candidateRepository;

        // Lưu file vào wwwroot/uploads/cvs
        _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "cvs");
        Directory.CreateDirectory(_uploadPath);
    }

    public async Task<UploadCVResponse> UploadCVAsync(int userId, IFormFile file)
    {
        // Validate file
        if (file == null || file.Length == 0)
            throw new Exception("File không hợp lệ.");

        var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
        var extension = Path.GetExtension(file.FileName).ToLower();
        if (!allowedExtensions.Contains(extension))
            throw new Exception("Chỉ chấp nhận file PDF, DOC, DOCX.");

        if (file.Length > 5 * 1024 * 1024)
            throw new Exception("File không được vượt quá 5MB.");

        var candidate = await _candidateRepository.GetByUserIdAsync(userId)
            ?? throw new Exception("Không tìm thấy hồ sơ ứng viên.");

        // Tạo tên file unique
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var fullPath = Path.Combine(_uploadPath, uniqueFileName);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var cv = new CV
        {
            CandidateId = candidate.CandidateId,
            FileName = file.FileName,
            FilePath = $"/uploads/cvs/{uniqueFileName}"
        };

        await _cvRepository.AddAsync(cv);
        await _cvRepository.SaveChangesAsync();

        return new UploadCVResponse
        {
            CVId = cv.CVId,
            FileName = cv.FileName,
            UploadedAt = cv.UploadedAt
        };
    }

    public async Task<List<CVResponse>> GetMyCVsAsync(int userId)
    {
        var candidate = await _candidateRepository.GetByUserIdAsync(userId)
            ?? throw new Exception("Không tìm thấy hồ sơ ứng viên.");

        var cvs = await _cvRepository.GetByCandidateIdAsync(candidate.CandidateId);

        return cvs.Select(c => new CVResponse
        {
            CVId = c.CVId,
            FileName = c.FileName,
            UploadedAt = c.UploadedAt,
            FilePath = c.FilePath
        }).ToList();
    }
}