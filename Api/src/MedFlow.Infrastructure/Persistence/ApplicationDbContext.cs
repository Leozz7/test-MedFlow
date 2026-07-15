using Microsoft.EntityFrameworkCore;
using MedFlow.Domain.Entities;
using MedFlow.Infrastructure.Persistence.Interceptors;

namespace MedFlow.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    private readonly AuditableEntitySaveChangesInterceptor _auditableEntitySaveChangesInterceptor;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor) 
        : base(options)
    {
        _auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<MedicalExam> Exams => Set<MedicalExam>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Apply configurations from this assembly
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        
        base.OnModelCreating(builder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(_auditableEntitySaveChangesInterceptor);
    }
}
