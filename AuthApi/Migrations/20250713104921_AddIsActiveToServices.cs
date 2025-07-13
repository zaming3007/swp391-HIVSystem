using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class AddIsActiveToServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                table: "Services",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "id",
                keyValue: "1",
                column: "is_active",
                value: true);

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "id",
                keyValue: "2",
                column: "is_active",
                value: true);

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "id",
                keyValue: "3",
                column: "is_active",
                value: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "1",
                column: "created_at",
                value: new DateTime(2025, 7, 13, 10, 49, 21, 161, DateTimeKind.Utc).AddTicks(3101));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(2025, 7, 13, 10, 49, 21, 161, DateTimeKind.Utc).AddTicks(5604));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(2025, 7, 13, 10, 49, 21, 161, DateTimeKind.Utc).AddTicks(5613));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_active",
                table: "Services");

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
    }
}
