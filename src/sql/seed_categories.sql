-- Common Table Expression (CTE) for level 1 categories
WITH ins_level1 AS (
    INSERT INTO categories (name, parent_id, level, note, slug) VALUES 
        ('Bán nhà đất', NULL, 1, 'Bán nhà đất', 'Ban-nha-dat'),
        ('Cho thuê', NULL, 1, 'Cho thuê', 'Cho-thue'),
        ('Sang nhượng', NULL, 1, 'Sang nhượng', 'Sang-nhuong'),
        ('Dịch vụ', NULL, 1, 'Dịch vụ', 'Dich-vu')
    RETURNING id, name, slug
),

-- CTE for level 2 categories
ins_level2 AS (
    INSERT INTO categories (name, parent_id, level, note, slug) VALUES
        ('Bán nhà', (SELECT id FROM ins_level1 WHERE name = 'Bán nhà đất'), 2, '', 'Ban-nha'),
        ('Bán căn hộ', (SELECT id FROM ins_level1 WHERE name = 'Bán nhà đất'), 2, '', 'Ban-can-ho'),
        ('Bán đất', (SELECT id FROM ins_level1 WHERE name = 'Bán nhà đất'), 2, '', 'Ban-dat'),
        ('Nhà', (SELECT id FROM ins_level1 WHERE name = 'Cho thuê'), 2, 'Nha', ''),
        ('Căn hộ, Chung cư, Khách sạn', (SELECT id FROM ins_level1 WHERE name = 'Cho thuê'), 2, '', 'Can-Ho-Khach-San'),
        ('Nhà trọ, phòng trọ', (SELECT id FROM ins_level1 WHERE name = 'Cho thuê'), 2, '', 'Nha-tro'),
        ('Văn phòng, mặt bằng', (SELECT id FROM ins_level1 WHERE name = 'Cho thuê'), 2, '', 'Van-phong-Mat-bang'),
        ('Nhà xưởng, kho, đất', (SELECT id FROM ins_level1 WHERE name = 'Cho thuê'), 2, '', 'Nha-xuong-Kho-dat'),
        ('Kiốt, Sạp chợ', (SELECT id FROM ins_level1 WHERE name = 'Sang nhượng'), 2, '', 'Kiot-Sap-cho'),
        ('Quán ăn, Nhà hàng, Khách sạn', (SELECT id FROM ins_level1 WHERE name = 'Sang nhượng'), 2, '', 'Nha-hang-Khach-san'),
        ('Quán cà phê, Đồ uống', (SELECT id FROM ins_level1 WHERE name = 'Sang nhượng'), 2, '', 'Quan-ca-phe-Do-uong'),
        ('shop thời trang, tiệm tóc, spa', (SELECT id FROM ins_level1 WHERE name = 'Sang nhượng'), 2, '', 'Shop-Thoi-trang-Spa'),
        ('shophouse', (SELECT id FROM ins_level1 WHERE name = 'Sang nhượng'), 2, '', 'Shop-house')
    RETURNING id, name, slug
),

-- CTE for level 3 categories under Computers
ins_level3_comp AS (
    INSERT INTO categories (name, parent_id, level, note, slug) VALUES
        ('Nhà mặt tiền', (SELECT id FROM ins_level2 WHERE name = 'Bán nhà'), 3, 'Nha-mat-tien', ''),
        ('Nhà hẻm, ngõ', (SELECT id FROM ins_level2 WHERE name = 'Bán nhà'), 3, 'Nha-hem', ''),
        ('Biệt thự, Villa', (SELECT id FROM ins_level2 WHERE name = 'Bán nhà'), 3, 'Biet-thu-Villa', ''),
        ('Chung cư', (SELECT id FROM ins_level2 WHERE name = 'Bán căn hộ'), 3, '', 'Chung-cu'),
        ('penthouse', (SELECT id FROM ins_level2 WHERE name = 'Bán căn hộ'), 3, '', 'penthouse'),
        ('Căn hộ dịch vụ, mini', (SELECT id FROM ins_level2 WHERE name = 'Bán căn hộ'), 3, '', 'can-ho-dich-vu'),
        ('Tập thể, cư xá', (SELECT id FROM ins_level2 WHERE name = 'Bán căn hộ'), 3, '', 'Tap-the-cu-xa'),
        ('Officetel', (SELECT id FROM ins_level2 WHERE name = 'Bán căn hộ'), 3, '', 'officetel'),
        ('Đất dự án, khu dân cư', (SELECT id FROM ins_level2 WHERE name = 'Bán đất'), 3, '', 'dat-du-an-khu-dan-cu'),
        ('Đất thổ cư', (SELECT id FROM ins_level2 WHERE name = 'Bán đất'), 3, '', 'dat-tho-cu'),
        ('Đất nông nghiệp, kho bãi', (SELECT id FROM ins_level2 WHERE name = 'Bán đất'), 3, '', 'dat-nong-nghiep-kho-bai')
    RETURNING id, name, slug
)

-- Select statement to execute all CTEs
SELECT * FROM ins_level1
UNION ALL
SELECT * FROM ins_level2
UNION ALL
SELECT * FROM ins_level3_comp;
