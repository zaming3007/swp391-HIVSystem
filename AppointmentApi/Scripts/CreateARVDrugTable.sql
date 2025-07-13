-- ARVDrugs table already exists from AuthApi migration with integer Id
-- Just insert data using the existing table structure

-- Insert sample ARV drugs (using integer Ids to match existing table)
INSERT INTO "ARVDrugs" ("Name", "GenericName", "BrandName", "DrugClass", "Description", "Dosage", "Form", "SideEffects", "Contraindications", "Instructions", "IsActive", "IsPregnancySafe", "IsPediatricSafe", "MinAge", "MinWeight", "CreatedAt", "UpdatedAt", "CreatedBy", "UpdatedBy") VALUES
('Tenofovir/Emtricitabine', 'Tenofovir disoproxil fumarate + Emtricitabine', 'Truvada', 'NRTI', 'Thuốc kết hợp 2 NRTI, thường dùng trong phác đồ tuyến 1', '300mg/200mg', 'Viên nén', 'Buồn nôn, đau đầu, mệt mỏi, rối loạn thận', '', 'Uống 1 viên/ngày, có thể uống cùng hoặc không cùng thức ăn', true, true, false, 18, 35, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'System', 'System'),
('Efavirenz', 'Efavirenz', 'Sustiva', 'NNRTI', 'NNRTI thế hệ 1, hiệu quả cao trong điều trị HIV', '600mg', 'Viên nén', 'Chóng mặt, mơ mộng bất thường, rối loạn tâm thần', '', 'Uống 1 viên/ngày vào buổi tối, tránh uống cùng thức ăn nhiều chất béo', true, false, false, 18, 40, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'System', 'System'),
('Dolutegravir', 'Dolutegravir', 'Tivicay', 'INSTI', 'Thuốc ức chế integrase thế hệ 2, ít tác dụng phụ', '50mg', 'Viên nén', 'Đau đầu, buồn nôn nhẹ, mất ngủ', '', 'Uống 1 viên/ngày, có thể uống cùng hoặc không cùng thức ăn', true, true, true, 12, 30, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'System', 'System'),
('Lopinavir/Ritonavir', 'Lopinavir + Ritonavir', 'Kaletra', 'PI', 'Thuốc ức chế protease, thường dùng trong phác đồ tuyến 2', '200mg/50mg', 'Viên nén', 'Tiêu chảy, buồn nôn, tăng cholesterol', '', 'Uống 2 viên x 2 lần/ngày cùng thức ăn', true, true, true, 6, 15, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'System', 'System'),
('Zidovudine', 'Zidovudine', 'Retrovir', 'NRTI', 'NRTI thế hệ đầu, vẫn sử dụng trong một số trường hợp đặc biệt', '300mg', 'Viên nang', 'Thiếu máu, giảm bạch cầu, mệt mỏi', '', 'Uống 1 viên x 2 lần/ngày, tránh uống cùng thức ăn nhiều chất béo', true, true, true, 3, 10, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'System', 'System'),
('Rilpivirine', 'Rilpivirine', 'Edurant', 'NNRTI', 'NNRTI thế hệ 2, ít tác dụng phụ hơn Efavirenz', '25mg', 'Viên nén', 'Đau đầu, buồn nôn, mệt mỏi', '', 'Uống 1 viên/ngày cùng thức ăn', true, false, false, 18, 35, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'System', 'System'),
('Raltegravir', 'Raltegravir', 'Isentress', 'INSTI', 'Thuốc ức chế integrase thế hệ 1', '400mg', 'Viên nén', 'Đau đầu, buồn nôn, mệt mỏi', '', 'Uống 1 viên x 2 lần/ngày', true, true, true, 4, 10, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'System', 'System'),
('Darunavir/Ritonavir', 'Darunavir + Ritonavir', 'Prezista', 'PI', 'Thuốc ức chế protease thế hệ mới', '800mg/100mg', 'Viên nén', 'Tiêu chảy, buồn nôn, phát ban', '', 'Uống 1 lần/ngày cùng thức ăn', true, false, true, 3, 10, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'System', 'System'),
('Abacavir/Lamivudine', 'Abacavir + Lamivudine', 'Epzicom', 'NRTI', 'Thuốc kết hợp 2 NRTI', '600mg/300mg', 'Viên nén', 'Buồn nôn, đau đầu, phản ứng dị ứng', '', 'Uống 1 viên/ngày', true, true, true, 3, 14, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'System', 'System'),
('Elvitegravir/Cobicistat', 'Elvitegravir + Cobicistat', 'Stribild', 'INSTI', 'Thuốc kết hợp INSTI với chất tăng cường', '150mg/150mg', 'Viên nén', 'Buồn nôn, đau đầu, tiêu chảy', '', 'Uống 1 viên/ngày cùng thức ăn', true, false, false, 18, 35, '2025-01-01 00:00:00+00', '2025-01-01 00:00:00+00', 'System', 'System');

-- Update migration history to mark ARVDrug table as created
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion") 
VALUES ('20250713052500_AddARVDrugTable', '8.0.0')
ON CONFLICT ("MigrationId") DO NOTHING;
