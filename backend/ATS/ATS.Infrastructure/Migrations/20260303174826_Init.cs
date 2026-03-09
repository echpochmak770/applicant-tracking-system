using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ATS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatedById",
                table: "Applications",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Applications_CreatedById",
                table: "Applications",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Users_CreatedById",
                table: "Applications",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Users_CreatedById",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_Applications_CreatedById",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Applications");
        }
    }
}
