using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRemindersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "1",
                column: "created_at",
                value: new DateTime(2025, 7, 1, 10, 39, 20, 629, DateTimeKind.Utc).AddTicks(8310));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(2025, 7, 1, 10, 39, 20, 630, DateTimeKind.Utc).AddTicks(100));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(2025, 7, 1, 10, 39, 20, 630, DateTimeKind.Utc).AddTicks(105));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "1",
                column: "created_at",
                value: new DateTime(2025, 7, 1, 8, 41, 42, 756, DateTimeKind.Utc).AddTicks(9139));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(2025, 7, 1, 8, 41, 42, 757, DateTimeKind.Utc).AddTicks(1021));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(2025, 7, 1, 8, 41, 42, 757, DateTimeKind.Utc).AddTicks(1027));
        }
    }
}
