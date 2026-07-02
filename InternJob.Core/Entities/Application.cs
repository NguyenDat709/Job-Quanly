namespace InternJob.Core.Entities;

public class Application
{
    public int ApplicationId { get; set; }
    public int JobId { get; set; }
    public int CandidateId { get; set; }
    public int CVId { get; set; }
    public string Status { get; set; } = "Đang xem xét";
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public JobPosting Job { get; set; } = null!;
    public CandidateProfile Candidate { get; set; } = null!;
    public CV CV { get; set; } = null!;
}