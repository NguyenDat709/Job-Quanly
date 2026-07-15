using InternJob.Core.DTOs.Application;
using InternJob.Core.Entities;
using InternJob.Core.Interfaces.Repositories;
using InternJob.Core.Interfaces.Services;

namespace InternJob.Infrastructure.Services;

public class ApplicationService : IApplicationService
{
    private readonly IApplicationRepository _applicationRepository;
    private readonly ICandidateRepository _candidateRepository;
    private readonly IJobRepository _jobRepository;
    private readonly ICVRepository _cvRepository;
    private readonly IEmployerRepository _employerRepository;

    public ApplicationService(
        IApplicationRepository applicationRepository,
        ICandidateRepository candidateRepository,
        IJobRepository jobRepository,
        ICVRepository cvRepository,
        IEmployerRepository employerRepository)
    {
        _applicationRepository = applicationRepository;
        _candidateRepository = candidateRepository;
        _jobRepository = jobRepository;
        _cvRepository = cvRepository;
        _employerRepository = employerRepository;
    }

    public async Task<ApplicationResponse> ApplyJobAsync(int userId, int jobId, ApplyJobRequest request)
    {
        var candidate = await _candidateRepository.GetByUserIdAsync(userId)
            ?? throw new Exception("Không tìm thấy hồ sơ ứng viên.");

        var job = await _jobRepository.GetByIdWithDetailsAsync(jobId)
            ?? throw new Exception("Không tìm thấy tin tuyển dụng.");

        if (job.Status != "Approved")
            throw new Exception("Tin tuyển dụng không còn nhận hồ sơ.");

        if (job.Deadline < DateTime.UtcNow)
            throw new Exception("Tin tuyển dụng đã hết hạn nộp hồ sơ.");

        if (await _applicationRepository.ExistsAsync(jobId, candidate.CandidateId))
            throw new Exception("Bạn đã ứng tuyển vị trí này rồi.");

        // Kiểm tra CV thuộc về candidate này
        var cv = await _cvRepository.GetByIdAsync(request.CvId)
            ?? throw new Exception("Không tìm thấy CV.");
        System.Diagnostics.Debug.WriteLine("DEBUG CHECK: FilePath của CV là: " + (cv.FilePath ?? "ĐANG BỊ NULL"));
        if (cv.CandidateId != candidate.CandidateId)
            throw new Exception("CV không thuộc về tài khoản của bạn.");

        var application = new Application
        {
            JobId = jobId,
            CandidateId = candidate.CandidateId,
            CVId = request.CvId,
            Status = "Đang xem xét",
            SubmittedCVPath = cv.FilePath
        };

        await _applicationRepository.AddAsync(application);
        await _applicationRepository.SaveChangesAsync();

        return new ApplicationResponse
        {
            ApplicationId = application.ApplicationId,
            Status = application.Status,
            AppliedAt = application.AppliedAt,
            JobId = job.JobId,
            JobTitle = job.Title,
            CompanyName = job.Employer.CompanyName,
            Location = job.Location,
            CVId = cv.CVId,
            CVFileName = cv.FileName
        };
    }

    public async Task<List<ApplicationResponse>> GetApplicationsByEmployerIdAsync(int employerId)
    {
       var employer = await _employerRepository.GetByUserIdAsync(employerId)
        ?? throw new Exception("Không tìm thấy nhà tuyển dụng.");

    var applications = await _applicationRepository
        .GetAllByEmployerIdAsync(employer.EmployerId);

    return applications.Select(a => new ApplicationResponse
    {
        ApplicationId = a.ApplicationId,
        Status = a.Status,
        AppliedAt = a.AppliedAt,
        JobId = a.Job.JobId,
        JobTitle = a.Job.Title,
        CompanyName = a.Job.Employer!.CompanyName,
        Location = a.Job.Location,
        CVId = a.CV.CVId,
        CVFileName = a.CV.FileName,
        CVPath = a.CV.FilePath
    }).ToList();
    }

    public async Task<List<ApplicationResponse>> GetMyApplicationsAsync(int userId)
    {
        var candidate = await _candidateRepository.GetByUserIdAsync(userId)
            ?? throw new Exception("Không tìm thấy hồ sơ ứng viên.");

        var applications = await _applicationRepository.GetByCandidateIdAsync(candidate.CandidateId);

        return applications.Select(a => new ApplicationResponse
        {
            ApplicationId = a.ApplicationId,
            Status = a.Status,
            AppliedAt = a.AppliedAt,
            JobId = a.Job.JobId,
            JobTitle = a.Job.Title,
            CompanyName = a.Job.Employer.CompanyName,
            Location = a.Job.Location,
            CVId = a.CV.CVId,
            CVFileName = a.CV.FileName
        }).ToList();
    }
}