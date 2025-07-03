using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class AddRemindersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Reminders",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    reminder_type = table.Column<string>(type: "text", nullable: false),
                    start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    end_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    time = table.Column<TimeSpan>(type: "interval", nullable: false),
                    recurrence = table.Column<string>(type: "text", nullable: false),
                    recurrence_days = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    medication_name = table.Column<string>(type: "text", nullable: false),
                    dosage = table.Column<string>(type: "text", nullable: false),
                    doctor_id = table.Column<string>(type: "text", nullable: false),
                    appointment_id = table.Column<string>(type: "text", nullable: false),
                    is_read = table.Column<bool>(type: "boolean", nullable: false),
                    last_notification_sent = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reminders", x => x.id);
                    table.ForeignKey(
                        name: "FK_Reminders_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_Reminders_user_id",
                table: "Reminders",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reminders");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "1",
                column: "created_at",
                value: new DateTime(2025, 6, 29, 5, 49, 5, 160, DateTimeKind.Utc).AddTicks(794));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(2025, 6, 29, 5, 49, 5, 160, DateTimeKind.Utc).AddTicks(2793));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(2025, 6, 29, 5, 49, 5, 160, DateTimeKind.Utc).AddTicks(2799));
        }
    }
}
