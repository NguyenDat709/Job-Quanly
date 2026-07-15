namespace InternJob.Core.DTOs.Application;

public class ApplicationResponse
{
    public int ApplicationId { get; set; }
    public string Status { get; set; } = null!;
    public DateTime AppliedAt { get; set; }

    // Job info
    public int JobId { get; set; }
    public string JobTitle { get; set; } = null!;
    public string CompanyName { get; set; } = null!;
    public string Location { get; set; } = null!;

    // CV info
    public int CVId { get; set; }
    public string CVFileName { get; set; } = null!;
    public string CVPath { get; set; } = null!;
}