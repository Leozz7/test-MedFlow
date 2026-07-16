using System.Security.Claims;
using MedFlow.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace MedFlow.Api.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) 
                             ?? _httpContextAccessor.HttpContext?.User?.FindFirstValue("sub");
}
