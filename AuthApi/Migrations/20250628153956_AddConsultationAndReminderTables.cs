using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class AddConsultationAndReminderTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "consultations",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    patient_id = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    question = table.Column<string>(type: "text", nullable: false),
                    category = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_consultations", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "medication_reminders",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    medication_name = table.Column<string>(type: "text", nullable: false),
                    dosage = table.Column<string>(type: "text", nullable: false),
                    frequency = table.Column<string>(type: "text", nullable: false),
                    start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    end_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    reminder_times = table.Column<string>(type: "text", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_medication_reminders", x => x.id);
                    table.ForeignKey(
                        name: "FK_medication_reminders_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "answers",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    consultation_id = table.Column<string>(type: "text", nullable: false),
                    responder_id = table.Column<string>(type: "text", nullable: false),
                    responder_name = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_answers", x => x.id);
                    table.ForeignKey(
                        name: "FK_answers_consultations_consultation_id",
                        column: x => x.consultation_id,
                        principalTable: "consultations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "consultations",
                columns: new[] { "id", "category", "created_at", "patient_id", "question", "status", "title" },
                values: new object[,]
                {
                    { "1", "Điều trị", new DateTime(2024, 12, 22, 0, 0, 0, 0, DateTimeKind.Utc), "4", "Tôi muốn biết thêm về các tác dụng phụ của phác đồ điều trị ARV hiện tại?", "pending", "Câu hỏi về liệu trình điều trị" },
                    { "2", "Dinh dưỡng", new DateTime(2024, 12, 25, 0, 0, 0, 0, DateTimeKind.Utc), "4", "Tôi nên ăn gì để tăng cường hệ miễn dịch khi đang điều trị?", "answered", "Tư vấn về dinh dưỡng" },
                    { "3", "Điều trị", new DateTime(2024, 12, 27, 0, 0, 0, 0, DateTimeKind.Utc), "4", "Gần đây tôi bị mất ngủ sau khi uống thuốc, tôi nên làm gì?", "answered", "Câu hỏi về tác dụng phụ thuốc" }
                });

            migrationBuilder.InsertData(
                table: "medication_reminders",
                columns: new[] { "id", "created_at", "dosage", "end_date", "frequency", "medication_name", "notes", "reminder_times", "start_date", "updated_at", "user_id" },
                values: new object[,]
                {
                    { "1", new DateTime(2024, 12, 2, 0, 0, 0, 0, DateTimeKind.Utc), "1 viên", null, "daily", "ARV Combo", "Uống sau khi ăn sáng", "[\"08:00\"]", new DateTime(2024, 12, 2, 0, 0, 0, 0, DateTimeKind.Utc), null, "4" },
                    { "2", new DateTime(2024, 12, 17, 0, 0, 0, 0, DateTimeKind.Utc), "2 viên", null, "daily", "Vitamin D", "Uống cùng bữa trưa", "[\"12:00\"]", new DateTime(2024, 12, 17, 0, 0, 0, 0, DateTimeKind.Utc), null, "4" }
                });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: "4",
                column: "created_at",
                value: new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.InsertData(
                table: "answers",
                columns: new[] { "id", "consultation_id", "content", "created_at", "responder_id", "responder_name" },
                values: new object[,]
                {
                    { "1", "2", "Chế độ ăn giàu protein, vitamin và khoáng chất sẽ giúp tăng cường hệ miễn dịch. Nên ăn nhiều rau xanh, trái cây, thịt nạc và cá. Hãy đảm bảo uống đủ nước và hạn chế đồ ăn nhiều dầu mỡ và đường.", new DateTime(2024, 12, 26, 0, 0, 0, 0, DateTimeKind.Utc), "2", "Doctor User" },
                    { "2", "3", "Tình trạng mất ngủ có thể là tác dụng phụ của một số loại thuốc ARV. Tôi khuyên bạn nên uống thuốc vào buổi sáng thay vì buổi tối. Nếu tình trạng vẫn tiếp tục, hãy đặt lịch hẹn để chúng ta có thể đánh giá và điều chỉnh phác đồ nếu cần.", new DateTime(2024, 12, 28, 0, 0, 0, 0, DateTimeKind.Utc), "2", "Doctor User" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_answers_consultation_id",
                table: "answers",
                column: "consultation_id");

            migrationBuilder.CreateIndex(
                name: "IX_medication_reminders_user_id",
                table: "medication_reminders",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "answers");

            migrationBuilder.DropTable(
                name: "medication_reminders");

            migrationBuilder.DropTable(
                name: "consultations");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: "4",
                column: "created_at",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
