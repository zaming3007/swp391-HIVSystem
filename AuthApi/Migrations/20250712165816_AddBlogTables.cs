using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class AddBlogTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "profile_image",
                table: "Users",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");



            migrationBuilder.CreateTable(
                name: "BlogPosts",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    summary = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    author_id = table.Column<string>(type: "text", nullable: false),
                    author_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    view_count = table.Column<int>(type: "integer", nullable: false),
                    comment_count = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    published_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogPosts", x => x.id);
                    table.ForeignKey(
                        name: "FK_BlogPosts_Users_author_id",
                        column: x => x.author_id,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });



            migrationBuilder.CreateTable(
                name: "BlogComments",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    blog_post_id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    user_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    content = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogComments", x => x.id);
                    table.ForeignKey(
                        name: "FK_BlogComments_BlogPosts_blog_post_id",
                        column: x => x.blog_post_id,
                        principalTable: "BlogPosts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BlogComments_Users_user_id",
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
                value: new DateTime(2025, 7, 12, 16, 58, 14, 844, DateTimeKind.Utc).AddTicks(7775));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 16, 58, 14, 845, DateTimeKind.Utc).AddTicks(30));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 16, 58, 14, 845, DateTimeKind.Utc).AddTicks(37));



            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_blog_post_id",
                table: "BlogComments",
                column: "blog_post_id");

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_user_id",
                table: "BlogComments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_author_id",
                table: "BlogPosts",
                column: "author_id");


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {


            migrationBuilder.DropTable(
                name: "BlogComments");



            migrationBuilder.DropTable(
                name: "BlogPosts");





            migrationBuilder.AlterColumn<string>(
                name: "profile_image",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

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
    }
}
