using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MedFlow.Domain.Entities;

namespace MedFlow.Infrastructure.Persistence.Configurations;

public class MedicalExamConfiguration : IEntityTypeConfiguration<MedicalExam>
{
    public void Configure(EntityTypeBuilder<MedicalExam> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.FileName)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(t => t.Status)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(t => t.ProcessingResult)
            .HasMaxLength(1000);

        builder.Property(t => t.Report)
            .HasMaxLength(4000);
    }
}
