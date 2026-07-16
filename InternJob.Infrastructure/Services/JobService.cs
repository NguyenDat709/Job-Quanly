using InternJob.Core.DTOs;
using InternJob.Core.DTOs.Job;
using InternJob.Core.Entities;
using InternJob.Core.Interfaces.Repositories;
using InternJob.Core.Interfaces.Services;

namespace InternJob.Infrastructure.Services;

public class JobService : IJobService
{
    private readonly IJobRepository _jobRepository;
    private readonly IEmployerRepository _employerRepository;
    private readonly ICategoryRepository _categoryRepository;

    public JobService(
        IJobRepository jobRepository,
        IEmployerRepository employerRepository,
        ICategoryRepository categoryRepository)
    {
        _jobRepository = jobRepository;
        _employerRepository = employerRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<JobResponse> CreateJobAsync(int userId, CreateJobRequest request)
    {
        var employer = await _employerRepository.GetByUserIdAsync(userId)
            ?? throw new Exception("Không tìm thấy hồ sơ nhà tuyển dụng.");
        if (request.Deadline <= DateTime.UtcNow)
            throw new Exception("Hạn nộp hồ sơ phải là ngày trong tương lai.");

        var job = new JobPosting
        {
            EmployerId = employer.EmployerId,
            CategoryId = request.CategoryId,
            Title = request.Title,
            Description = request.Description,
            Requirements = request.Requirements,
            Salary = request.Salary,
            SalaryMin= request.SalaryMin,
            SalaryMax= request.SalaryMax,
            Location = request.Location,
            Deadline = request.Deadline,
            Status = "Pending"
        };

        await _jobRepository.AddAsync(job);
        await _jobRepository.SaveChangesAsync();

        var created = await _jobRepository.GetByIdWithDetailsAsync(job.JobId);
        return MapToResponse(created!);
    }

    public async Task<JobResponse> UpdateJobAsync(int userId, int jobId, UpdateJobRequest request)
    {
        var employer = await _employerRepository.GetByUserIdAsync(userId)
            ?? throw new Exception("Không tìm thấy hồ sơ nhà tuyển dụng.");

        var job = await _jobRepository.GetByIdAsync(jobId)
            ?? throw new Exception("Không tìm thấy tin tuyển dụng.");

        if (job.EmployerId != employer.EmployerId)
            throw new Exception("Bạn không có quyền chỉnh sửa tin này.");

        if (job.Status == "Closed")
            throw new Exception("Không thể chỉnh sửa tin đã đóng.");

        if (request.Deadline <= DateTime.UtcNow)
            throw new Exception("Hạn nộp hồ sơ phải là ngày trong tương lai.");

        job.Title = request.Title;
        job.Description = request.Description;
        job.Requirements = request.Requirements;
        job.Salary = request.Salary;
        job.SalaryMin = request.SalaryMin;
        job.SalaryMax = request.SalaryMax;
        job.Location = request.Location;
        job.Deadline = request.Deadline;
        job.CategoryId = request.CategoryId;

        await _jobRepository.SaveChangesAsync();

        var updated = await _jobRepository.GetByIdWithDetailsAsync(job.JobId);
        return MapToResponse(updated!);
    }

    public async Task CloseJobAsync(int userId, int jobId)
    {
        var employer = await _employerRepository.GetByUserIdAsync(userId)
            ?? throw new Exception("Không tìm thấy hồ sơ nhà tuyển dụng.");

        var job = await _jobRepository.GetByIdAsync(jobId)
            ?? throw new Exception("Không tìm thấy tin tuyển dụng.");

        if (job.EmployerId != employer.EmployerId)
            throw new Exception("Bạn không có quyền đóng tin này.");

        if (job.Status == "Closed")
            throw new Exception("Tin tuyển dụng đã đóng trước đó.");

        job.Status = "Closed";
        await _jobRepository.SaveChangesAsync();
    }

    public async Task<List<JobResponse>> GetMyJobsAsync(int userId)
    {
        var employer = await _employerRepository.GetByUserIdAsync(userId)
            ?? throw new Exception("Không tìm thấy hồ sơ nhà tuyển dụng.");

        var jobs = await _jobRepository.GetByEmployerIdAsync(employer.EmployerId);
        return jobs.Select(MapToResponse).ToList();
    }

    public async Task<PagedResponse<JobListResponse>> SearchJobsAsync(JobSearchRequest request)
    {
        var (items, total) = await _jobRepository.SearchAsync(
            request.Keyword,
            request.Location,
            request.CategoryId,
            request.Page,
            request.PageSize);

        return new PagedResponse<JobListResponse>
        {
            Items = items.Select(MapToListResponse).ToList(),
            TotalItems = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<JobResponse> GetJobDetailAsync(int jobId)
    {
        var job = await _jobRepository.GetByIdWithDetailsAsync(jobId)
            ?? throw new Exception("Không tìm thấy tin tuyển dụng.");

        // if ( job.Status != "Pending")
        //     throw new Exception("Tin tuyển dụng không còn hiển thị.");

        return MapToResponse(job);
    }

    // ---------- Helper ----------
    private static JobResponse MapToResponse(JobPosting j) => new()
    {
        JobId = j.JobId,
        Title = j.Title,
        Description = j.Description,
        Requirements = j.Requirements,
        Salary = j.Salary,
        SalaryMin = j.SalaryMin,
        SalaryMax = j.SalaryMax,
        Location = j.Location,
        Deadline = j.Deadline,
        Status = j.Status,
        CreatedAt = j.CreatedAt,
        EmployerId = j.EmployerId,
        CompanyName = j.Employer.CompanyName,
        CompanyLogo = j.Employer.Logo,
        CategoryId = j.CategoryId,
        CategoryName = j.Category.CategoryName
    };

    private static JobListResponse MapToListResponse(JobPosting j) => new()
    {
        JobId = j.JobId,
        Title = j.Title,
        SalaryMin = j.SalaryMin,
        SalaryMax = j.SalaryMax,
        Salary = j.Salary,
        Location = j.Location,
        Deadline = j.Deadline,
        Status = j.Status,
        CreatedAt = j.CreatedAt,
        CompanyName = j.Employer.CompanyName,
        CompanyLogo = j.Employer.Logo,
        CategoryName = j.Category.CategoryName
    };
}