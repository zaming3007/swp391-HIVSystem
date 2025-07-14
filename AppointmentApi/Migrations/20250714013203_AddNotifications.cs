using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppointmentApi.Migrations
{
    /// <inheritdoc />
    public partial class AddNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Message = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Priority = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ActionUrl = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ActionText = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    RelatedEntityId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    RelatedEntityType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Metadata = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_DoctorId",
                table: "TestResults",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_PatientId",
                table: "TestResults",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_TestDate",
                table: "TestResults",
                column: "TestDate");

            migrationBuilder.CreateIndex(
                name: "IX_TestResults_TestType",
                table: "TestResults",
                column: "TestType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_TestResults_DoctorId",
                table: "TestResults");

            migrationBuilder.DropIndex(
                name: "IX_TestResults_PatientId",
                table: "TestResults");

            migrationBuilder.DropIndex(
                name: "IX_TestResults_TestDate",
                table: "TestResults");

            migrationBuilder.DropIndex(
                name: "IX_TestResults_TestType",
                table: "TestResults");
        }
    }
}
