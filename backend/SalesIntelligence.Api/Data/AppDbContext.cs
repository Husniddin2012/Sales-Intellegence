using Microsoft.EntityFrameworkCore;
using SalesIntelligence.Api.Domain.Entities;
using SalesIntelligence.Api.Domain.ValueObjects;

namespace SalesIntelligence.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<LeadEntity> Leads => Set<LeadEntity>();
    public DbSet<SalesAgentEntity> Agents => Set<SalesAgentEntity>();
    public DbSet<ProductEntity> Products => Set<ProductEntity>();
    public DbSet<RootCauseEntity> RootCauses => Set<RootCauseEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // UserEntity
        modelBuilder.Entity<UserEntity>(b =>
        {
            b.HasKey(u => u.Id);
            b.HasIndex(u => u.Email).IsUnique();
            b.Property(u => u.FullName).IsRequired().HasMaxLength(150);
            b.Property(u => u.Email).IsRequired().HasMaxLength(150);
        });

        // LeadEntity
        modelBuilder.Entity<LeadEntity>(b =>
        {
            b.HasKey(l => l.Id);
            b.Property(l => l.EstimatedValue)
                .HasConversion(
                    v => v.Amount,
                    v => new Money(v, "UZS")
                );
        });

        // SalesAgentEntity
        modelBuilder.Entity<SalesAgentEntity>(b =>
        {
            b.HasKey(a => a.Id);
            b.Property(a => a.ResponseTime)
                .HasConversion(
                    v => v.Minutes,
                    v => new ResponseTime(v, 5)
                );
        });

        // ProductEntity
        modelBuilder.Entity<ProductEntity>(b =>
        {
            b.HasKey(p => p.Id);
            b.Property(p => p.Price)
                .HasConversion(
                    v => v.Amount,
                    v => new Money(v, "UZS")
                );
            b.Property(p => p.LostRevenue)
                .HasConversion(
                    v => v.Amount,
                    v => new Money(v, "UZS")
                );
        });

        // RootCauseEntity
        modelBuilder.Entity<RootCauseEntity>(b =>
        {
            b.HasKey(r => r.Id);
            b.Property(r => r.LostRevenue)
                .HasConversion(
                    v => v.Amount,
                    v => new Money(v, "UZS")
                );
        });
    }
}
