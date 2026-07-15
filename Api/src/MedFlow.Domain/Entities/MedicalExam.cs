using System;
using MedFlow.Domain.Common;
using MedFlow.Domain.Enums;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Domain.Entities;

public class MedicalExam : BaseEntity
{
    public string FileName { get; private set; }
    public ExamStatus Status { get; private set; }
    public string? ProcessingResult { get; private set; }
    public string? Report { get; private set; }

    // Construtor vazio para o EF Core
    protected MedicalExam() { }

    public MedicalExam(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            throw new DomainException("O nome do arquivo não pode ser vazio.");

        FileName = fileName;
        Status = ExamStatus.PENDING;
    }

    public void StartProcessing()
    {
        if (Status != ExamStatus.PENDING)
            throw new DomainException("O exame não está pendente para ser processado.");

        Status = ExamStatus.PROCESSING;
    }

    public void CompleteProcessing(string result)
    {
        if (Status != ExamStatus.PROCESSING)
            throw new DomainException("Apenas exames em processamento podem ser concluídos.");

        Status = ExamStatus.DONE;
        ProcessingResult = result;
    }

    public void FailProcessing(string error)
    {
        if (Status != ExamStatus.PROCESSING)
            throw new DomainException("Apenas exames em processamento podem falhar.");

        Status = ExamStatus.ERROR;
        ProcessingResult = error;
    }

    public void EmitReport(string report)
    {
        if (Status != ExamStatus.DONE)
            throw new DomainException("Laudos só podem ser emitidos para exames com status DONE.");

        if (string.IsNullOrWhiteSpace(report))
            throw new DomainException("O laudo não pode ser vazio.");

        Status = ExamStatus.REPORTED;
        Report = report;
    }
}