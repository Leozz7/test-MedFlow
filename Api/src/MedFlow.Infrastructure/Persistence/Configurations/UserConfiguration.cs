using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedFlow.Domain.Entities;

namespace MedFlow.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(t => t.Email)
            .HasMaxLength(100)
            .IsRequired();
            
        builder.HasIndex(t => t.Email)
            .IsUnique();

        builder.Property(t => t.PasswordHash)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(t => t.Role)
            .IsRequired()
            .HasConversion<string>();
    }
}
