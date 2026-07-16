using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MedFlow.Application.Interfaces.Auth;
using MedFlow.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace MedFlow.Infrastructure.Authentication;

/// <summary>
/// Geração de JWT com claims: sub, email, role.
/// Configuração lida de "Jwt:Key", "Jwt:Issuer", "Jwt:Audience", "Jwt:ExpirationHours".
/// </summary>
public sealed class TokenService : ITokenService
{
    private readonly string _key;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expirationHours;

    public TokenService(IConfiguration configuration)
    {
        _key = configuration["Jwt:Key"]
               ?? throw new InvalidOperationException("Jwt:Key não está configurado.");
        _issuer = configuration["Jwt:Issuer"]
                  ?? throw new InvalidOperationException("Jwt:Issuer não está configurado.");
        _audience = configuration["Jwt:Audience"]
                    ?? throw new InvalidOperationException("Jwt:Audience não está configurado.");
        _expirationHours = int.TryParse(configuration["Jwt:ExpirationHours"], out var h) ? h : 2;
    }

    public string GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new("role", user.Role.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_expirationHours),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
