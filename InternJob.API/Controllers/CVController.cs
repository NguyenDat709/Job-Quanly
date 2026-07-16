using System.Security.Claims;
using InternJob.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternJob.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Candidate")]
public class CVController : ControllerBase
{
    private readonly ICVService _cvService;

    public CVController(ICVService cvService)
    {
        _cvService = cvService;
    }
    // POST api/cv/upload
    [HttpPost("upload")]
    public async Task<IActionResult> UploadCV(IFormFile file)
    {
        try
        {
            var userId = GetUserId();
            var result = await _cvService.UploadCVAsync(userId, file);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/cv/myCV
    [HttpGet("myCV")]
    public async Task<IActionResult> GetMyCVs()
    {
        try
        {
            var userId = GetUserId();
            var result = await _cvService.GetMyCVsAsync(userId);
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