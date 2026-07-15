namespace InternJob.Core.DTOs.CV;

public class CVResponse
{
    public int CVId { get; set; }
    public string FileName { get; set; } = null!;
    public DateTime UploadedAt { get; set; }
    public string FilePath { get; set; }=null!;
}