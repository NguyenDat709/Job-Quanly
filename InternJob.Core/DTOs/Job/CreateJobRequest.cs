using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace InternJob.Core.DTOs.Job;

public class CreateJobRequest
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
    [MaxLength(150)]
    public string Location { get; set; } = null!;

    [Required]
    public DateTime Deadline { get; set; }

    [Required]
    public int CategoryId { get; set; }
}