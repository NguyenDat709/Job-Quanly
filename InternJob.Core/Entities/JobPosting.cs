namespace InternJob.Core.Entities;

public class JobPosting
{
    public int JobId { get; set; }
    public int EmployerId { get; set; }
    public int CategoryId { get; set; }
 
    public string? Title { get; set; } 
    public string? Description { get; set; }
    public string? Requirements { get; set; }
    public string? Salary { get; set; } = "Thỏa thuận";
    public int SalaryMin { get; set; }
    public int SalaryMax { get; set; }
    public string? Location { get; set; }
    
    public DateTime Deadline { get; set; }
    public string? Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public EmployerProfile? Employer { get; set; }
    public JobCategory? Category { get; set; }
}