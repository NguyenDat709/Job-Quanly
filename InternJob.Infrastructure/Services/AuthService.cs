using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InternJob.Core.DTOs.Auth;
using InternJob.Core.Entities;
using InternJob.Core.Interfaces.Services;
using InternJob.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;

namespace InternJob.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Kiểm tra email đã tồn tại
        var exists = await _context.Users.AnyAsync(u => u.Email == request.Email);
        if (exists)
            throw new Exception("Email đã được sử dụng.");

        // Validate Employer phải có CompanyName
        if (request.Role == "Employer" && string.IsNullOrWhiteSpace(request.CompanyName))
            throw new Exception("Nhà tuyển dụng phải cung cấp tên công ty.");

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            FullName = request.FullName,
            Phone = request.Phone
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Tạo profile tương ứng
        if (request.Role == "Candidate")
        {
            _context.CandidateProfiles.Add(new CandidateProfile { UserId = user.UserId });
        }
        else if (request.Role == "Employer")
        {
            _context.EmployerProfiles.Add(new EmployerProfile
            {
                UserId = user.UserId,
                CompanyName = request.CompanyName!
            });
        }

        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            Token = GenerateToken(user),
            Role = user.Role,
            FullName = user.FullName,
            UserId = user.UserId
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new Exception("Email hoặc mật khẩu không đúng.");
        var token = GenerateToken(user); // Tạo token trước
    
        // THÊM DÒNG NÀY ĐỂ KIỂM TRA
        System.Diagnostics.Debug.WriteLine("DEBUG: Đăng nhập thành công!");
        System.Diagnostics.Debug.WriteLine("DEBUG: Token đã tạo: " + token);
        return new AuthResponse
        {
            Token = GenerateToken(user),
            Role = user.Role,
            FullName = user.FullName,
            UserId = user.UserId
        };
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
