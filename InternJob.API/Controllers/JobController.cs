using System.Security.Claims;
using InternJob.Core.DTOs.Job;
using InternJob.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternJob.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobController(IJobService jobService)
    {
        _jobService = jobService;
    }

    // POST api/job
    [HttpPost]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetUserId();
            var result = await _jobService.CreateJobAsync(userId, request);
            return CreatedAtAction(nameof(CreateJob), new { id = result.JobId }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT api/job/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> UpdateJob(int id, [FromBody] UpdateJobRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetUserId();
            var result = await _jobService.UpdateJobAsync(userId, id, request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PATCH api/job/{id}/close
    [HttpPatch("{id}/close")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> CloseJob(int id)
    {
        try
        {
            var userId = GetUserId();
            await _jobService.CloseJobAsync(userId, id);
            return Ok(new { message = "Đã đóng tin tuyển dụng." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/job/my
    [HttpGet("my")]
    [Authorize(Roles = "Employer")]
    public async Task<IActionResult> GetMyJobs()
    {
        try
        {
            var userId = GetUserId();
            var result = await _jobService.GetMyJobsAsync(userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/job?keyword=&location=&categoryId=&page=&pageSize=
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchJobs([FromQuery] JobSearchRequest request)
    {
        try
        {
            var result = await _jobService.SearchJobsAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/job/{id}
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetJobDetail(int id)
    {
        try
        {
            var result = await _jobService.GetJobDetailAsync(id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }


    // ---------- Helper ----------
    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new Exception("Không xác định được người dùng.");
        return int.Parse(claim);
    }
}