namespace InternJob.Core.Entities;

public class JobPosting
{
    public int JobId { get; set; }
    public int EmployerId { get; set; }
    public int CategoryId { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Requirements { get; set; } = null!;
    public string Salary { get; set; } = "Thỏa thuận";
    public string Location { get; set; } = null!;
    public DateTime Deadline { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public EmployerProfile Employer { get; set; } = null!;
    public JobCategory Category { get; set; } = null!;
}
