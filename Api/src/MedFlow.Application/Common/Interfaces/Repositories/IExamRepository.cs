using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MedFlow.Domain.Entities;
using MedFlow.Domain.Enums;

namespace MedFlow.Application.Interfaces.Repositories;

public interface IExamRepository
{
    Task<MedicalExam?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<MedicalExam>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<MedicalExam>> GetByStatusAsync(ExamStatus status, CancellationToken cancellationToken = default);
    void Add(MedicalExam exam);
    void Update(MedicalExam exam);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
