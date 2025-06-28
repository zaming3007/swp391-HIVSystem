using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    first_name = table.Column<string>(type: "text", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    phone = table.Column<string>(type: "text", nullable: false),
                    gender = table.Column<string>(type: "text", nullable: false),
                    date_of_birth = table.Column<string>(type: "text", nullable: false),
                    role = table.Column<string>(type: "text", nullable: false),
                    profile_image = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "created_at", "date_of_birth", "email", "first_name", "gender", "last_name", "password_hash", "phone", "profile_image", "role", "updated_at" },
                values: new object[,]
                {
                    { "1", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "1990-01-01", "admin@example.com", "Admin", "Male", "User", "$2a$11$ij4jecQmQGXMbP1qdQYz4.YaXiMvz2dGXRKNVKGMsPNWMeGsEfTdm", "0123456789", "/admin-avatar.jpg", "admin", null },
                    { "2", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "1985-05-15", "doctor@example.com", "Doctor", "Female", "User", "$2a$11$ij4jecQmQGXMbP1qdQYz4.YaXiMvz2dGXRKNVKGMsPNWMeGsEfTdm", "0987654321", "/doctor-avatar.jpg", "doctor", null },
                    { "3", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "1992-10-20", "staff@example.com", "Staff", "Male", "User", "$2a$11$ij4jecQmQGXMbP1qdQYz4.YaXiMvz2dGXRKNVKGMsPNWMeGsEfTdm", "0123498765", "/staff-avatar.jpg", "staff", null },
                    { "4", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "1995-03-25", "customer@example.com", "Customer", "Female", "User", "$2a$11$ij4jecQmQGXMbP1qdQYz4.YaXiMvz2dGXRKNVKGMsPNWMeGsEfTdm", "0987612345", "/customer-avatar.jpg", "customer", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                table: "users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
