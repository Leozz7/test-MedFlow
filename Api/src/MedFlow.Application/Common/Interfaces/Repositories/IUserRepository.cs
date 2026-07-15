using System;
using System.Threading;
using System.Threading.Tasks;
using MedFlow.Domain.Entities;

namespace MedFlow.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default);
    void Add(User user);
    void Update(User user);
    void Remove(User user);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
