namespace InternJob.Core.Entities
{
    public class EmployerProfile
    {
        public int EmployerId { get; set; }
        public int UserId { get; set; }
        public string CompanyName { get; set; } = null!;
        public string? CompanyDesc { get; set; }
        public string? Logo { get; set; }
        public string? Website { get; set; }

        // Navigation
        public User User { get; set; } = null!;

        public ICollection<JobPosting> JobPostings { get; set; } = new List<JobPosting>();
    }
}
