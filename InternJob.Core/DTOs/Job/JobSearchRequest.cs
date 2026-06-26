namespace InternJob.Core.DTOs.Job;

public class JobSearchRequest
{
    // Tìm theo từ khóa
    public string? Keyword { get; set; }

    // Tìm theo địa điểm
    public string? Location { get; set; }

    // Tìm theo danh mục
    public int? CategoryId { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}