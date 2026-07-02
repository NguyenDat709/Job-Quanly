using System.Security.Claims;
using InternJob.Core.DTOs.Application;
using InternJob.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternJob.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Candidate")]
public class ApplicationController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    // POST api/application/job/{jobId}
    [HttpPost("job/{jobId}")]
    public async Task<IActionResult> ApplyJob(int jobId, [FromBody] ApplyJobRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetUserId();
            var result = await _applicationService.ApplyJobAsync(userId, jobId, request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/application/my
    [HttpGet("my")]
    public async Task<IActionResult> GetMyApplications()
    {
        try
        {
            var userId = GetUserId();
            var result = await _applicationService.GetMyApplicationsAsync(userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new Exception("Không xác định được người dùng.");
        return int.Parse(claim);
    }
}