namespace InternJob.Core.DTOs.Job;

public class JobListResponse
{
    public int JobId { get; set; }
    public string Title { get; set; } = null!;
    public string Salary { get; set; } = null!;
    public int SalaryMin { get; set; }
    public int SalaryMax { get; set; }
    public string Location { get; set; } = null!;
    public DateTime Deadline { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public string CompanyName { get; set; } = null!;
    public string? CompanyLogo { get; set; }
    public string CategoryName { get; set; } = null!;
}