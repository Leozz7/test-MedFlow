using System.Net;
using System.Text.Json;
using MedFlow.Domain.Exceptions;

namespace MedFlow.Api.Middlewares;

/// <summary>
/// Intercepta exceções de domínio e de validação e as converte
/// em respostas HTTP padronizadas (RFC 7807 – Problem Details).
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
            _logger.LogWarning("Tentativa de acesso não autorizado: {Message}", ex.Message);
            await WriteJsonResponse(context, HttpStatusCode.Unauthorized, "Unauthorized", ex.Message);
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
                title = "One or more validation errors occurred.",
                status = 400,
                errors
            });

            await context.Response.WriteAsync(body);
        }
        catch (DomainException ex)
        {
            _logger.LogWarning("Erro de negócio: {Message}", ex.Message);
            await WriteJsonResponse(context, HttpStatusCode.BadRequest, "Business Rule Violation", ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro inesperado.");
            await WriteJsonResponse(context, HttpStatusCode.InternalServerError,
                "Internal Server Error", "Ocorreu um erro inesperado. Tente novamente mais tarde.");
        }
    }

    private static async Task WriteJsonResponse(
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
