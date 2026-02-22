using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BackendApi.Api.Entity;
using BackendApi.Api.Helpers;
using BackendApi.Api.Models; // Added this using statement

namespace BackendApi.Api.Data
{
    public class DefaultDbContext
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public DefaultDbContext(DbContextOptions<DefaultDbContext> options)
        : base(options)
    {
    }

        public virtual DbSet<Tenant> Tenant { get; set; }
        public virtual DbSet<Staff> Staff { get; set; }
        public virtual DbSet<Departments> Departments { get; set; }
        public virtual DbSet<MaritalStatus> MaritalStatus { get; set; }
        public virtual DbSet<Patient> Patients { get; set; }
        public virtual DbSet<PatientDoctorVisit> PatientDoctorVisits { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ✅ Identity table mapping (STRING based)
        builder.Entity<ApplicationUser>().ToTable("aspnetusers");
        builder.Entity<IdentityRole<Guid>>().ToTable("aspnetroles");
        builder.Entity<IdentityUserRole<Guid>>().ToTable("aspnetuserroles");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("aspnetuserclaims");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("aspnetuserlogins");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("aspnetroleclaims");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("aspnetusertokens");

            // =======================
            // Snake_case naming
            // =======================
            foreach (var entity in builder.Model.GetEntityTypes())
            {
                
                // Table names
                var tableName = entity.GetTableName();
                if (!string.IsNullOrWhiteSpace(tableName))
                    entity.SetTableName(tableName.ToSnakeCase());

                // Column names
                foreach (var property in entity.GetProperties())
                    property.SetColumnName(property.Name.ToSnakeCase());

                // Primary keys
                foreach (var key in entity.GetKeys())
                {
                    var keyName = key.GetName();
                    if (!string.IsNullOrWhiteSpace(keyName))
                        key.SetName(keyName.ToSnakeCase());
                }

                // Foreign keys
                foreach (var fk in entity.GetForeignKeys())
                {
                    var fkName = fk.GetConstraintName();
                    if (!string.IsNullOrWhiteSpace(fkName))
                        fk.SetConstraintName(fkName.ToSnakeCase());
                }

                // Indexes
                foreach (var index in entity.GetIndexes())
                {
                    var indexName = index.GetDatabaseName();
                    if (!string.IsNullOrWhiteSpace(indexName))
                        index.SetDatabaseName(indexName.ToSnakeCase());
                }
            }
        }
    }
}
