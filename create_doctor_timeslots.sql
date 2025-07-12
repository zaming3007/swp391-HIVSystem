-- Create TimeSlots for all doctors to fix appointment booking
-- This will allow customers to book appointments

-- Clear existing time slots first
DELETE FROM "TimeSlots";

-- Doctor 1: Minh Nguyễn (doctor-001) - Monday, Wednesday, Friday
-- Monday (1)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-001-mon-1', 'doctor-001', 1, '08:00', '12:00'),
('timeslot-001-mon-2', 'doctor-001', 1, '13:00', '17:00');

-- Wednesday (3)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-001-wed-1', 'doctor-001', 3, '08:00', '12:00'),
('timeslot-001-wed-2', 'doctor-001', 3, '13:00', '17:00');

-- Friday (5)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-001-fri-1', 'doctor-001', 5, '08:00', '12:00'),
('timeslot-001-fri-2', 'doctor-001', 5, '13:00', '17:00');

-- Doctor 2: Hoa Trần (doctor-002) - Tuesday, Thursday, Saturday
-- Tuesday (2)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-002-tue-1', 'doctor-002', 2, '08:00', '12:00'),
('timeslot-002-tue-2', 'doctor-002', 2, '13:00', '17:00');

-- Thursday (4)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-002-thu-1', 'doctor-002', 4, '08:00', '12:00'),
('timeslot-002-thu-2', 'doctor-002', 4, '13:00', '17:00');

-- Saturday (6)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-002-sat-1', 'doctor-002', 6, '08:00', '12:00'),
('timeslot-002-sat-2', 'doctor-002', 6, '13:00', '17:00');

-- Doctor 3: Tuấn Lê (doctor-003) - Monday to Friday
-- Monday (1)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-003-mon-1', 'doctor-003', 1, '08:00', '12:00'),
('timeslot-003-mon-2', 'doctor-003', 1, '13:00', '17:00');

-- Tuesday (2)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-003-tue-1', 'doctor-003', 2, '08:00', '12:00'),
('timeslot-003-tue-2', 'doctor-003', 2, '13:00', '17:00');

-- Wednesday (3)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-003-wed-1', 'doctor-003', 3, '08:00', '12:00'),
('timeslot-003-wed-2', 'doctor-003', 3, '13:00', '17:00');

-- Thursday (4)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-003-thu-1', 'doctor-003', 4, '08:00', '12:00'),
('timeslot-003-thu-2', 'doctor-003', 4, '13:00', '17:00');

-- Friday (5)
INSERT INTO "TimeSlots" (id, doctor_id, day_of_week, start_time, end_time) VALUES
('timeslot-003-fri-1', 'doctor-003', 5, '08:00', '12:00'),
('timeslot-003-fri-2', 'doctor-003', 5, '13:00', '17:00');

-- Verify the data
SELECT 
    ts.doctor_id,
    d.first_name || ' ' || d.last_name as doctor_name,
    ts.day_of_week,
    CASE ts.day_of_week
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
        WHEN 0 THEN 'Sunday'
    END as day_name,
    ts.start_time,
    ts.end_time
FROM "TimeSlots" ts
JOIN "Doctors" d ON ts.doctor_id = d.id
ORDER BY ts.doctor_id, ts.day_of_week, ts.start_time;
