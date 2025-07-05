-- Kiểm tra và sửa lỗi cấu trúc bảng Consultations
DO $$
BEGIN
    -- Kiểm tra nếu bảng Consultations đã tồn tại
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Consultations') THEN
        -- Kiểm tra và thêm cột topic nếu chưa có
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Consultations' AND column_name = 'topic') THEN
            ALTER TABLE public."Consultations" ADD COLUMN "topic" text;
        END IF;
        
        -- Kiểm tra và thêm cột updated_at nếu chưa có
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Consultations' AND column_name = 'updated_at') THEN
            ALTER TABLE public."Consultations" ADD COLUMN "updated_at" timestamp with time zone;
        END IF;
    ELSE
        -- Tạo bảng Consultations nếu chưa tồn tại
        CREATE TABLE public."Consultations" (
            "id" text NOT NULL PRIMARY KEY,
            "patient_id" text NOT NULL,
            "title" text NOT NULL,
            "question" text NOT NULL,
            "category" text NOT NULL,
            "topic" text,
            "status" text NOT NULL,
            "created_at" timestamp with time zone NOT NULL,
            "updated_at" timestamp with time zone,
            CONSTRAINT "FK_Consultations_Users_patient_id" FOREIGN KEY ("patient_id") 
                REFERENCES public."Users" ("id") ON DELETE CASCADE
        );
        
        -- Tạo index
        CREATE INDEX "IX_Consultations_patient_id" ON public."Consultations" ("patient_id");
        CREATE INDEX "IX_Consultations_status" ON public."Consultations" ("status");
    END IF;
    
    -- Kiểm tra nếu bảng Answers đã tồn tại
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Answers') THEN
        -- Kiểm tra và thêm cột updated_at nếu chưa có
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Answers' AND column_name = 'updated_at') THEN
            ALTER TABLE public."Answers" ADD COLUMN "updated_at" timestamp with time zone;
        END IF;
    ELSE
        -- Tạo bảng Answers nếu chưa tồn tại
        CREATE TABLE public."Answers" (
            "id" text NOT NULL PRIMARY KEY,
            "consultation_id" text NOT NULL,
            "responder_id" text NOT NULL,
            "responder_name" text NOT NULL,
            "content" text NOT NULL,
            "created_at" timestamp with time zone NOT NULL,
            "updated_at" timestamp with time zone,
            CONSTRAINT "FK_Answers_Consultations_consultation_id" FOREIGN KEY ("consultation_id") 
                REFERENCES public."Consultations" ("id") ON DELETE CASCADE,
            CONSTRAINT "FK_Answers_Users_responder_id" FOREIGN KEY ("responder_id") 
                REFERENCES public."Users" ("id") ON DELETE CASCADE
        );
        
        -- Tạo index
        CREATE INDEX "IX_Answers_consultation_id" ON public."Answers" ("consultation_id");
        CREATE INDEX "IX_Answers_responder_id" ON public."Answers" ("responder_id");
    END IF;
    
    -- Kiểm tra nếu bảng ConsultationTopics đã tồn tại
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ConsultationTopics') THEN
        -- Tạo bảng ConsultationTopics nếu chưa tồn tại
        CREATE TABLE public."ConsultationTopics" (
            "id" text NOT NULL PRIMARY KEY,
            "name" text NOT NULL,
            "description" text,
            "created_at" timestamp with time zone NOT NULL,
            "updated_at" timestamp with time zone
        );
        
        -- Thêm dữ liệu mẫu cho chủ đề tư vấn
        INSERT INTO public."ConsultationTopics" ("id", "name", "description", "created_at") VALUES
        ('1', 'ARV', 'Thuốc kháng virus và phác đồ điều trị', NOW()),
        ('2', 'CD4', 'Xét nghiệm CD4 và ý nghĩa', NOW()),
        ('3', 'Tải lượng virus', 'Xét nghiệm tải lượng virus và ý nghĩa', NOW()),
        ('4', 'Tác dụng phụ', 'Tác dụng phụ của thuốc ARV và cách xử lý', NOW()),
        ('5', 'Dinh dưỡng', 'Chế độ dinh dưỡng cho người sống chung với HIV', NOW()),
        ('6', 'Sức khỏe tinh thần', 'Sức khỏe tinh thần và tâm lý', NOW()),
        ('7', 'Phòng ngừa', 'Phòng ngừa lây nhiễm và tái nhiễm', NOW()),
        ('8', 'Khác', 'Các chủ đề khác', NOW());
    END IF;
END
$$; 