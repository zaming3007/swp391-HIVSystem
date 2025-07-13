using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveImageUrlFromServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "image_url",
                table: "Services");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "1",
                column: "created_at",
                value: new DateTime(2025, 7, 13, 11, 25, 33, 60, DateTimeKind.Utc).AddTicks(5597));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(2025, 7, 13, 11, 25, 33, 60, DateTimeKind.Utc).AddTicks(7313));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(2025, 7, 13, 11, 25, 33, 60, DateTimeKind.Utc).AddTicks(7366));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "image_url",
                table: "Services",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "id",
                keyValue: "1",
                column: "image_url",
                value: "/services/general-checkup.jpg");

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "id",
                keyValue: "2",
                column: "image_url",
                value: "/services/nutrition-consulting.jpg");

            migrationBuilder.UpdateData(
                table: "Services",
                keyColumn: "id",
                keyValue: "3",
                column: "image_url",
                value: "/services/dermatology.jpg");

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
    }
}
