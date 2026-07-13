namespace InternJob.Core.DTOs.Job;

public class JobResponse
{
    public int JobId { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Requirements { get; set; } = null!;
    public string Salary { get; set; } = null!;
    public int SalaryMin { get; set; }
    public int SalaryMax { get; set; }
    public string Location { get; set; } = null!;
    public DateTime Deadline { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    // Thông tin công ty
    public int EmployerId { get; set; }
    public string CompanyName { get; set; } = null!;
    public string? CompanyLogo { get; set; }

    // Danh mục
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
}
