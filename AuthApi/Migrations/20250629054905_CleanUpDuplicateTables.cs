using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class CleanUpDuplicateTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_answers_consultations_consultation_id",
                table: "answers");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_doctors_doctor_id",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_services_service_id",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_appointments_users_patient_id",
                table: "appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_doctor_services_doctors_doctor_id",
                table: "doctor_services");

            migrationBuilder.DropForeignKey(
                name: "FK_doctor_services_services_service_id",
                table: "doctor_services");

            migrationBuilder.DropForeignKey(
                name: "FK_medication_reminders_users_user_id",
                table: "medication_reminders");

            migrationBuilder.DropForeignKey(
                name: "FK_time_slots_doctors_doctor_id",
                table: "time_slots");

            migrationBuilder.DropPrimaryKey(
                name: "PK_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_services",
                table: "services");

            migrationBuilder.DropPrimaryKey(
                name: "PK_doctors",
                table: "doctors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_consultations",
                table: "consultations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_appointments",
                table: "appointments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_answers",
                table: "answers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_time_slots",
                table: "time_slots");

            migrationBuilder.DropPrimaryKey(
                name: "PK_medication_reminders",
                table: "medication_reminders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_doctor_services",
                table: "doctor_services");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "services",
                newName: "Services");

            migrationBuilder.RenameTable(
                name: "doctors",
                newName: "Doctors");

            migrationBuilder.RenameTable(
                name: "consultations",
                newName: "Consultations");

            migrationBuilder.RenameTable(
                name: "appointments",
                newName: "Appointments");

            migrationBuilder.RenameTable(
                name: "answers",
                newName: "Answers");

            migrationBuilder.RenameTable(
                name: "time_slots",
                newName: "TimeSlots");

            migrationBuilder.RenameTable(
                name: "medication_reminders",
                newName: "MedicationReminders");

            migrationBuilder.RenameTable(
                name: "doctor_services",
                newName: "DoctorServices");

            migrationBuilder.RenameIndex(
                name: "IX_users_email",
                table: "Users",
                newName: "IX_Users_email");

            migrationBuilder.RenameIndex(
                name: "IX_appointments_service_id",
                table: "Appointments",
                newName: "IX_Appointments_service_id");

            migrationBuilder.RenameIndex(
                name: "IX_appointments_patient_id",
                table: "Appointments",
                newName: "IX_Appointments_patient_id");

            migrationBuilder.RenameIndex(
                name: "IX_appointments_doctor_id",
                table: "Appointments",
                newName: "IX_Appointments_doctor_id");

            migrationBuilder.RenameIndex(
                name: "IX_answers_consultation_id",
                table: "Answers",
                newName: "IX_Answers_consultation_id");

            migrationBuilder.RenameIndex(
                name: "IX_time_slots_doctor_id",
                table: "TimeSlots",
                newName: "IX_TimeSlots_doctor_id");

            migrationBuilder.RenameIndex(
                name: "IX_medication_reminders_user_id",
                table: "MedicationReminders",
                newName: "IX_MedicationReminders_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_doctor_services_service_id",
                table: "DoctorServices",
                newName: "IX_DoctorServices_service_id");

            migrationBuilder.RenameIndex(
                name: "IX_doctor_services_doctor_id",
                table: "DoctorServices",
                newName: "IX_DoctorServices_doctor_id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Services",
                table: "Services",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Doctors",
                table: "Doctors",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Consultations",
                table: "Consultations",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Appointments",
                table: "Appointments",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Answers",
                table: "Answers",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TimeSlots",
                table: "TimeSlots",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicationReminders",
                table: "MedicationReminders",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DoctorServices",
                table: "DoctorServices",
                column: "id");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Answers_Consultations_consultation_id",
                table: "Answers",
                column: "consultation_id",
                principalTable: "Consultations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Doctors_doctor_id",
                table: "Appointments",
                column: "doctor_id",
                principalTable: "Doctors",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Services_service_id",
                table: "Appointments",
                column: "service_id",
                principalTable: "Services",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Users_patient_id",
                table: "Appointments",
                column: "patient_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorServices_Doctors_doctor_id",
                table: "DoctorServices",
                column: "doctor_id",
                principalTable: "Doctors",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorServices_Services_service_id",
                table: "DoctorServices",
                column: "service_id",
                principalTable: "Services",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicationReminders_Users_user_id",
                table: "MedicationReminders",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TimeSlots_Doctors_doctor_id",
                table: "TimeSlots",
                column: "doctor_id",
                principalTable: "Doctors",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Answers_Consultations_consultation_id",
                table: "Answers");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Doctors_doctor_id",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Services_service_id",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Users_patient_id",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorServices_Doctors_doctor_id",
                table: "DoctorServices");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorServices_Services_service_id",
                table: "DoctorServices");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicationReminders_Users_user_id",
                table: "MedicationReminders");

            migrationBuilder.DropForeignKey(
                name: "FK_TimeSlots_Doctors_doctor_id",
                table: "TimeSlots");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Services",
                table: "Services");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Doctors",
                table: "Doctors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Consultations",
                table: "Consultations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Appointments",
                table: "Appointments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Answers",
                table: "Answers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TimeSlots",
                table: "TimeSlots");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicationReminders",
                table: "MedicationReminders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DoctorServices",
                table: "DoctorServices");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "users");

            migrationBuilder.RenameTable(
                name: "Services",
                newName: "services");

            migrationBuilder.RenameTable(
                name: "Doctors",
                newName: "doctors");

            migrationBuilder.RenameTable(
                name: "Consultations",
                newName: "consultations");

            migrationBuilder.RenameTable(
                name: "Appointments",
                newName: "appointments");

            migrationBuilder.RenameTable(
                name: "Answers",
                newName: "answers");

            migrationBuilder.RenameTable(
                name: "TimeSlots",
                newName: "time_slots");

            migrationBuilder.RenameTable(
                name: "MedicationReminders",
                newName: "medication_reminders");

            migrationBuilder.RenameTable(
                name: "DoctorServices",
                newName: "doctor_services");

            migrationBuilder.RenameIndex(
                name: "IX_Users_email",
                table: "users",
                newName: "IX_users_email");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_service_id",
                table: "appointments",
                newName: "IX_appointments_service_id");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_patient_id",
                table: "appointments",
                newName: "IX_appointments_patient_id");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_doctor_id",
                table: "appointments",
                newName: "IX_appointments_doctor_id");

            migrationBuilder.RenameIndex(
                name: "IX_Answers_consultation_id",
                table: "answers",
                newName: "IX_answers_consultation_id");

            migrationBuilder.RenameIndex(
                name: "IX_TimeSlots_doctor_id",
                table: "time_slots",
                newName: "IX_time_slots_doctor_id");

            migrationBuilder.RenameIndex(
                name: "IX_MedicationReminders_user_id",
                table: "medication_reminders",
                newName: "IX_medication_reminders_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorServices_service_id",
                table: "doctor_services",
                newName: "IX_doctor_services_service_id");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorServices_doctor_id",
                table: "doctor_services",
                newName: "IX_doctor_services_doctor_id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_users",
                table: "users",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_services",
                table: "services",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_doctors",
                table: "doctors",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_consultations",
                table: "consultations",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_appointments",
                table: "appointments",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_answers",
                table: "answers",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_time_slots",
                table: "time_slots",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_medication_reminders",
                table: "medication_reminders",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_doctor_services",
                table: "doctor_services",
                column: "id");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: "1",
                column: "created_at",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_answers_consultations_consultation_id",
                table: "answers",
                column: "consultation_id",
                principalTable: "consultations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_doctors_doctor_id",
                table: "appointments",
                column: "doctor_id",
                principalTable: "doctors",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_services_service_id",
                table: "appointments",
                column: "service_id",
                principalTable: "services",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_appointments_users_patient_id",
                table: "appointments",
                column: "patient_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_doctor_services_doctors_doctor_id",
                table: "doctor_services",
                column: "doctor_id",
                principalTable: "doctors",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_doctor_services_services_service_id",
                table: "doctor_services",
                column: "service_id",
                principalTable: "services",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_medication_reminders_users_user_id",
                table: "medication_reminders",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_time_slots_doctors_doctor_id",
                table: "time_slots",
                column: "doctor_id",
                principalTable: "doctors",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
