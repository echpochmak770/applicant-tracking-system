using ATS.Domain.Common;
using ATS.Domain.Entities;
using ATS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ATS.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        private readonly ICurrentUserService _currentUserService;

        public AppDbContext(
            DbContextOptions<AppDbContext> options,
            ICurrentUserService currentUserService) 
            : base(options)
        {
            _currentUserService = currentUserService;
        }

        public DbSet<Application> Applications { get; set; }
        public DbSet<ApplicationHistory> ApplicationHistories { get; set; }
        public DbSet<Candidate> Candidates { get; set; }
        public DbSet<Communication> Communications { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Resume> Resumes { get; set; }
        public DbSet<Stage> Stages { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Vacancy> Vacancies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ApplySoftDeleteFilter(modelBuilder);

            modelBuilder.Entity<Application>(entity =>
            {
                entity.HasKey(a => a.Id);

                entity.HasMany(a => a.Histories)
                    .WithOne(h => h.Application)
                    .HasForeignKey(h => h.ApplicationId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Candidate)
                    .WithMany(c => c.Applications)
                    .HasForeignKey(a => a.CandidateId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Vacancy)
                    .WithMany(v => v.Applications)
                    .HasForeignKey(a => a.VacancyId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.CurrentStage)
                    .WithMany(cs => cs.Applications)
                    .HasForeignKey(a => a.CurrentStageId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(a => a.Communications)
                    .WithOne(c => c.Application)
                    .HasForeignKey(c => c.ApplicationId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Resume)
                    .WithMany(r => r.Applications)
                    .HasForeignKey(a => a.ResumeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.CreatedBy)
                    .WithMany(u => u.CreatedApplications)
                    .HasForeignKey(a => a.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(a => a.RejectionReason)
                    .HasMaxLength(2048);

                entity.HasIndex(a => a.CandidateId);
                entity.HasIndex(a => a.VacancyId);
                entity.HasIndex(a => a.CurrentStageId);
            });

            modelBuilder.Entity<ApplicationHistory>(entity =>
            {
                entity.HasKey(ah => ah.Id);

                entity.HasOne(ah => ah.Application)
                    .WithMany(a => a.Histories)
                    .HasForeignKey(ah => ah.ApplicationId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(ah => ah.FromStage)
                    .WithMany()
                    .HasForeignKey(ah => ah.FromStageId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired(false);

                entity.HasOne(ah => ah.ToStage)
                    .WithMany()
                    .HasForeignKey(ah => ah.ToStageId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired(false);

                entity.HasOne(ah => ah.ChangedBy)
                    .WithMany(u => u.Changes)
                    .HasForeignKey(ah => ah.ChangedById)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(ah => ah.Comment)
                    .HasMaxLength(2048);

                entity.HasIndex(ah => ah.ApplicationId);
            });

            modelBuilder.Entity<Candidate>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.HasMany(c => c.Resumes)
                    .WithOne(r => r.Candidate)
                    .HasForeignKey(r => r.CandidateId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(c => c.FirstName)
                    .HasMaxLength(64)
                    .IsRequired(true);

                entity.Property(c => c.LastName)
                    .HasMaxLength(64)
                    .IsRequired(true);

                entity.Property(c => c.Email)
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .IsRequired(true);

                entity.Property(c => c.Phone)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsRequired(false);

                entity.HasIndex(c => c.Email)
                    .IsUnique(true)
                    .HasFilter("[IsDeleted] = 0");
            });

            modelBuilder.Entity<Communication>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.HasOne(c => c.CreatedBy)
                    .WithMany(u => u.Communications)
                    .HasForeignKey(c => c.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(c => c.Content)
                    .HasMaxLength(2048)
                    .IsRequired(true);
            });

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Token)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.HasIndex(t => t.Token)
                    .IsUnique();

                entity.HasOne(t => t.User)
                    .WithMany()
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Resume>(entity =>
            {
                entity.HasKey(r => r.Id);

                entity.Property(r => r.FileName)
                    .HasMaxLength(128)
                    .IsRequired();

                entity.Property(r => r.FileUrl)
                    .HasMaxLength(512)
                    .IsRequired();
            });

            modelBuilder.Entity<Stage>(entity =>
            {
                entity.HasKey(s => s.Id);

                entity.HasOne(s => s.Vacancy)
                    .WithMany(v => v.Stages)
                    .HasForeignKey(s => s.VacancyId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(s => s.Name)
                    .HasMaxLength(128)
                    .IsRequired();

                entity.Property(s => s.Order)
                    .IsRequired();

                entity.Property(s => s.IsFinal)
                    .IsRequired();

                entity.HasIndex(s => new { s.VacancyId, s.Order })
                    .IsUnique();
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.HasMany(u => u.Vacancies)
                    .WithOne(v => v.CreatedBy)
                    .HasForeignKey(v => v.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired(true);

                entity.Property(u => u.FirstName)
                    .HasMaxLength(64)
                    .IsRequired(true);

                entity.Property(u => u.LastName)
                    .HasMaxLength(64)
                    .IsRequired(true);

                entity.Property(u => u.Email)
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .IsRequired(true);

                entity.Property(u => u.Phone)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsRequired(false);

                entity.HasIndex(u => u.Email)
                    .IsUnique(true)
                    .HasFilter("[IsDeleted] = 0");
            });

            modelBuilder.Entity<Vacancy>(entity =>
            {
                entity.HasKey(v => v.Id);

                entity.Property(v => v.Description)
                   .HasMaxLength(2048)
                   .IsRequired();

                entity.Property(v => v.Title)
                    .HasMaxLength(512)
                    .IsRequired();

                entity.Property(v => v.Status)
                    .HasConversion<string>()
                    .HasMaxLength(64)
                    .IsRequired();

                entity.HasOne(v => v.CreatedBy)
                    .WithMany(u => u.Vacancies)
                    .HasForeignKey(v => v.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired();
            });
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyEntityAuditLogic();
            return await base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            ApplyEntityAuditLogic();
            return base.SaveChanges();
        }

        private void ApplyEntityAuditLogic()
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        HandleAddedEntity(entry);
                        break;

                    case EntityState.Modified:
                        HandleModifiedEntity(entry);
                        break;

                    case EntityState.Deleted:
                        HandleDeletion(entry);
                        break;
                }
            }
        }

        private void HandleAddedEntity(EntityEntry<BaseEntity> entry)
        {
            entry.Entity.CreatedAt = DateTime.UtcNow;

            if (entry.Entity is Application app && _currentUserService.UserId.HasValue)
            {
                app.CreatedById = _currentUserService.UserId.Value;
            }
        }

        private void HandleModifiedEntity(EntityEntry<BaseEntity> entry)
        {
            if (entry.Entity.IsDeleted)
            {
                entry.State = EntityState.Unchanged;
            }
        }

        private void HandleDeletion(EntityEntry<BaseEntity> entry)
        {
            if (entry.Entity is RefreshToken)
            {
                return;
            }

            entry.State = EntityState.Modified;
            entry.Entity.IsDeleted = true;
        }

        private void ApplySoftDeleteFilter(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Application>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ApplicationHistory>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Candidate>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Communication>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Resume>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Stage>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Vacancy>().HasQueryFilter(e => !e.IsDeleted);
        }
    }
}
