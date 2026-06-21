using InternJob.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace InternJob.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<CandidateProfile> CandidateProfiles => Set<CandidateProfile>();
    public DbSet<EmployerProfile> EmployerProfiles => Set<EmployerProfile>();
    public DbSet<JobCategory> JobCategories => Set<JobCategory>();
    public DbSet<JobPosting> JobPostings => Set<JobPosting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.UserId);
            e.Property(u => u.Email).HasMaxLength(150).IsRequired();
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.PasswordHash).HasMaxLength(255).IsRequired();
            e.Property(u => u.Role).HasMaxLength(20).IsRequired();
            e.Property(u => u.FullName).HasMaxLength(100).IsRequired();
            e.Property(u => u.Phone).HasMaxLength(15);
        });

        // CandidateProfile
        modelBuilder.Entity<CandidateProfile>(e =>
        {
            e.HasKey(c => c.CandidateId);
            e.HasOne(c => c.User)
             .WithOne(u => u.CandidateProfile)
             .HasForeignKey<CandidateProfile>(c => c.UserId);
        });

        // EmployerProfile
        modelBuilder.Entity<EmployerProfile>(e =>
        {
            e.HasKey(ep => ep.EmployerId);
            e.Property(ep => ep.CompanyName).HasMaxLength(200).IsRequired();
            e.HasOne(ep => ep.User)
             .WithOne(u => u.EmployerProfile)
             .HasForeignKey<EmployerProfile>(ep => ep.UserId);
        });

        // JobCategory
        modelBuilder.Entity<JobCategory>(e =>
        {
            e.HasKey(c => c.CategoryId);
            e.Property(c => c.CategoryName).HasMaxLength(100).IsRequired();
            e.Property(c => c.Description).HasMaxLength(255);
        });

        // JobPosting
        modelBuilder.Entity<JobPosting>(e =>
        {
            e.HasKey(j => j.JobId);
            e.Property(j => j.Title).HasMaxLength(150).IsRequired();
            e.Property(j => j.Salary).HasMaxLength(50).HasDefaultValue("Thỏa thuận");
            e.Property(j => j.Location).HasMaxLength(150).IsRequired();
            e.Property(j => j.Status).HasMaxLength(20).HasDefaultValue("Pending");

            e.HasOne(j => j.Employer)
             .WithMany(ep => ep.JobPostings)
             .HasForeignKey(j => j.EmployerId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(j => j.Category)
             .WithMany(c => c.JobPostings)
             .HasForeignKey(j => j.CategoryId)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}