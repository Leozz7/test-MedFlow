using System.Net;
using System.Text.Json;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Api.Middlewares;

/// <summary>
/// Intercepta exceções de domínio e de validação e as converte
/// em respostas HTTP padronizadas (RFC 7807 – Problem Details).
///
/// Mapeamento:
///   UnauthorizedException  → 401 Unauthorized
///   NotFoundException      → 404 Not Found
///   ConflictException      → 409 Conflict
///   ValidationException    → 400 Bad Request  (com dicionário de erros por campo)
///   DomainException        → 400 Bad Request  (violação de regra de negócio genérica)
///   Exception              → 500 Internal Server Error
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning("Acesso não autorizado: {Message}", ex.Message);
            await WriteProblemDetails(context, HttpStatusCode.Unauthorized, "Unauthorized", ex.Message);
        }
        catch (NotFoundException ex)
        {
            _logger.LogWarning("Recurso não encontrado: {Message}", ex.Message);
            await WriteProblemDetails(context, HttpStatusCode.NotFound, "Not Found", ex.Message);
        }
        catch (ConflictException ex)
        {
            _logger.LogWarning("Conflito de recurso: {Message}", ex.Message);
            await WriteProblemDetails(context, HttpStatusCode.Conflict, "Conflict", ex.Message);
        }
        catch (FluentValidation.ValidationException ex)
        {
            var errors = ex.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray());

            _logger.LogWarning("Erro de validação: {@Errors}", errors);

            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/problem+json";

            var body = JsonSerializer.Serialize(new
            {
                title = "Erro de validação.",
                status = 400,
                errors
            });

            await context.Response.WriteAsync(body);
        }
        catch (DomainException ex)
        {
            _logger.LogWarning("Violação de regra de negócio: {Message}", ex.Message);
            await WriteProblemDetails(context, HttpStatusCode.BadRequest, "Bad Request", ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro inesperado na requisição {Method} {Path}",
                context.Request.Method, context.Request.Path);
            await WriteProblemDetails(context, HttpStatusCode.InternalServerError,
                "Internal Server Error", "Ocorreu um erro inesperado. Tente novamente mais tarde.");
        }
    }

    private static async Task WriteProblemDetails(
        HttpContext context,
        HttpStatusCode statusCode,
        string title,
        string detail)
    {
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/problem+json";

        var body = JsonSerializer.Serialize(new
        {
            title,
            status = (int)statusCode,
            detail
        });

        await context.Response.WriteAsync(body);
    }
}
