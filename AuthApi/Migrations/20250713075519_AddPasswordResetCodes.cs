using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPasswordResetCodes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PasswordResetCodes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Code = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false),
                    AttemptCount = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetCodes", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "ConsultationTopics",
                columns: new[] { "id", "created_at", "description", "name", "updated_at" },
                values: new object[,]
                {
                    { "1", new DateTime(2024, 12, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Câu hỏi về điều trị ARV và các phác đồ điều trị", "Điều trị", null },
                    { "2", new DateTime(2024, 12, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Câu hỏi về các xét nghiệm CD4, viral load", "Xét nghiệm", null },
                    { "3", new DateTime(2024, 12, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Câu hỏi về tác dụng phụ của thuốc", "Tác dụng phụ", null },
                    { "4", new DateTime(2024, 12, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Câu hỏi về chế độ ăn uống và dinh dưỡng", "Dinh dưỡng", null },
                    { "5", new DateTime(2024, 12, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Câu hỏi về phòng ngừa HIV và các biện pháp bảo vệ", "Phòng ngừa", null },
                    { "6", new DateTime(2024, 12, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Các câu hỏi khác liên quan đến HIV", "Khác", null }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "1",
                column: "created_at",
                value: new DateTime(2025, 7, 13, 7, 55, 17, 552, DateTimeKind.Utc).AddTicks(9958));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(2025, 7, 13, 7, 55, 17, 553, DateTimeKind.Utc).AddTicks(1717));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(2025, 7, 13, 7, 55, 17, 553, DateTimeKind.Utc).AddTicks(1722));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PasswordResetCodes");

            migrationBuilder.DeleteData(
                table: "ConsultationTopics",
                keyColumn: "id",
                keyValue: "1");

            migrationBuilder.DeleteData(
                table: "ConsultationTopics",
                keyColumn: "id",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "ConsultationTopics",
                keyColumn: "id",
                keyValue: "3");

            migrationBuilder.DeleteData(
                table: "ConsultationTopics",
                keyColumn: "id",
                keyValue: "4");

            migrationBuilder.DeleteData(
                table: "ConsultationTopics",
                keyColumn: "id",
                keyValue: "5");

            migrationBuilder.DeleteData(
                table: "ConsultationTopics",
                keyColumn: "id",
                keyValue: "6");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "1",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 18, 40, 15, 721, DateTimeKind.Utc).AddTicks(2131));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 18, 40, 15, 721, DateTimeKind.Utc).AddTicks(3992));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 18, 40, 15, 721, DateTimeKind.Utc).AddTicks(4021));
        }
    }
}
