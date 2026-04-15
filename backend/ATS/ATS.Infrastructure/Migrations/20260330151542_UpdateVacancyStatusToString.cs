using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ATS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVacancyStatusToString : Migration
    {
            protected override void Up(MigrationBuilder migrationBuilder)
            {
            migrationBuilder.AddColumn<string>(
                name: "StatusTemp",
                table: "Vacancies",
                type: "nvarchar(64)",
                nullable: false,
                defaultValue: "Draft");

            migrationBuilder.Sql(@"
                UPDATE Vacancies
                SET StatusTemp =
                    CASE Status
                        WHEN 0 THEN 'Draft'
                        WHEN 1 THEN 'Open'
                        WHEN 2 THEN 'Closed'
                        WHEN 3 THEN 'Paused'
                    END
            ");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Vacancies");

            migrationBuilder.RenameColumn(
                name: "StatusTemp",
                table: "Vacancies",
                newName: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
