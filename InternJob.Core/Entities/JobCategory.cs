namespace InternJob.Core.Entities;

public class JobCategory
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public string? Description { get; set; }

    // Navigation
    public ICollection<JobPosting> JobPostings { get; set; } = new List<JobPosting>();
}