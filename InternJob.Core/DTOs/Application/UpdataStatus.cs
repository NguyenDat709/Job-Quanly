using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace InternJob.Core.DTOs.Application;
public class UpdateApplicationStatusRequest
{
    public string Status { get; set; } = null!;
}