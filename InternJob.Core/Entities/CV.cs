using static System.Net.Mime.MediaTypeNames;

namespace InternJob.Core.Entities;

public class CV
{
    public int CVId { get; set; }
    public int CandidateId { get; set; }
    public string FileName { get; set; } = null!;
    public string FilePath { get; set; } = null!;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public CandidateProfile Candidate { get; set; } = null!;
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}