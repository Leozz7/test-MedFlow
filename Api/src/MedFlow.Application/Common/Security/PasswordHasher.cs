namespace MedFlow.Application.Common.Security;

using System;
using System.Security.Cryptography;
using System.Text;
using Isopoh.Cryptography.Argon2;
using Microsoft.Extensions.Configuration;

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash, out bool needsUpgrade);
}

public sealed class PasswordHasher : IPasswordHasher
{
    private readonly string _pepper;
    private readonly int _memoryCost;
    private readonly int _timeCost;
    private readonly int _lanes;

    private const int DefaultMemoryCost = 65536;
    private const int DefaultTimeCost = 3;
    private const int DefaultLanes = 4;

    public PasswordHasher(IConfiguration configuration)
    {
        _pepper = configuration["Security:PasswordPepper"] 
                  ?? throw new InvalidOperationException("PasswordPepper não está configurado no appsettings.json.");
        
        _memoryCost = int.TryParse(configuration["Security:Argon2MemoryCostKB"], out var mc) ? mc : DefaultMemoryCost;
        _timeCost = int.TryParse(configuration["Security:Argon2TimeCost"], out var tc) ? tc : DefaultTimeCost;
        _lanes = int.TryParse(configuration["Security:Argon2Lanes"], out var l) ? l : DefaultLanes;
    }

    public string Hash(string password)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(password);

        byte[] passwordBytes = Encoding.UTF8.GetBytes(password + _pepper);
        byte[] salt = RandomNumberGenerator.GetBytes(16);

        var config = new Argon2Config
        {
            Type = Argon2Type.HybridAddressing,
            Version = Argon2Version.Nineteen,          
            MemoryCost = _memoryCost,
            TimeCost = _timeCost,      
            Lanes = _lanes,        
            Password = passwordBytes,
            Salt = salt
        };

        try
        {
            return Argon2.Hash(config);
        }
        finally
        {
            CryptographicOperations.ZeroMemory(passwordBytes);
        }
    }

    public bool Verify(string password, string hash, out bool needsUpgrade)
    {
        needsUpgrade = false;

        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(hash))
        {
            return false;
        }

        if (!hash.StartsWith("$argon2", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        try
        {
            string saltedPassword = password + _pepper;
            bool isArgonValid = Argon2.Verify(hash, saltedPassword);

            if (isArgonValid && hash.StartsWith("$argon2i$", StringComparison.OrdinalIgnoreCase))
            {
                needsUpgrade = true;
            }

            return isArgonValid;
        }
        catch (FormatException)
        {
            return false;
        }
        catch (Exception)
        {
            return false;
        }
    }
}