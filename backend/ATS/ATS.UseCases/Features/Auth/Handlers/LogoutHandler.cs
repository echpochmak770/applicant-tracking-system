using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using ATS.UseCases.Features.Auth.Commands;
using MediatR;

namespace ATS.UseCases.Features.Auth.Handlers
{
    public class LogoutCommandHandler : IRequestHandler<LogoutCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public LogoutCommandHandler(
            IUnitOfWork unitOfWork,
            IRefreshTokenRepository refreshTokenRepository)
        {
            _unitOfWork = unitOfWork;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task Handle(LogoutCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                return;
            }

            var tokenEntry = await _refreshTokenRepository.GetByTokenAsync(
                request.RefreshToken,
                cancellationToken);

            if (tokenEntry != null)
            {
                _refreshTokenRepository.Delete(tokenEntry);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
        }
    }
}