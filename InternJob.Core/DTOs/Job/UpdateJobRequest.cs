using System.ComponentModel.DataAnnotations;

namespace InternJob.Core.DTOs.Job;

public class UpdateJobRequest
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = null!;

    [Required]
    public string Description { get; set; } = null!;

    [Required]
    public string Requirements { get; set; } = null!;

    [MaxLength(50)]
    public string Salary { get; set; } = "Thỏa thuận";

    [Required]
    public int SalaryMin { get; set; }

    [Required]
    public int SalaryMax { get; set; }

    [Required]
    [MaxLength(150)]
    public string Location { get; set; } = null!;

    [Required]
    public DateTime Deadline { get; set; }

    [Required]
    public int CategoryId { get; set; }
}