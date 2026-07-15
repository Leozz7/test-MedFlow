using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MedFlow.Application.Interfaces.Repositories;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;

namespace MedFlow.Infrastructure.Persistence.Repositories;

public class ExamRepository : IExamRepository
{
    private readonly ApplicationDbContext _context;

    public ExamRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public void Add(MedicalExam exam)
    {
        _context.Exams.Add(exam);
    }

    public async Task<IEnumerable<MedicalExam>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Exams.ToListAsync(cancellationToken);
    }

    public async Task<MedicalExam?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Exams.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<MedicalExam>> GetByStatusAsync(ExamStatus status, CancellationToken cancellationToken = default)
    {
        return await _context.Exams.Where(e => e.Status == status).ToListAsync(cancellationToken);
    }

    public void Update(MedicalExam exam)
    {
        _context.Exams.Update(exam);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
