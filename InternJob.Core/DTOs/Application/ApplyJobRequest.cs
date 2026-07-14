using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace InternJob.Core.DTOs.Application;

public class ApplyJobRequest
{
    [Required]
    [JsonPropertyName("cvId")]
    public int CvId { get; set; }
}