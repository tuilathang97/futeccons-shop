-- Common Table Expression (CTE) for level 1 categories
WITH ins_level1 AS (
  INSERT INTO categories (name, parent_id, level, note) VALUES
    ('Bán nhà đất', NULL, 1, 'Bán nhà đất')
    ('Cho thuê', NULL, 1, 'Cho thuê')
    ('Sang nhượng', NULL, 1, 'Sang nhượng')
    ('Dịch vụ', NULL, 1, 'Dịch vụ')
  RETURNING id, name
),

-- CTE for level 2 categories
ins_level2 AS (
  INSERT INTO categories (name, parent_id, level, note) VALUES
    ('Bán nhà', (SELECT id FROM ins_level1 WHERE name = 'Bán nhà đất'), 2, ''),
    ('Bán căn hộ', (SELECT id FROM ins_level1 WHERE name = 'Bán nhà đất'), 2, '')
    ('Bán đất', (SELECT id FROM ins_level1 WHERE name = 'Bán nhà đất'), 2, '')
    ('Nhà', (SELECT id FROM ins_level1 WHERE name = 'Cho thuê'), 2, '')
    ('Căn hộ, chung cư, Khách sạn', (SELECT id FROM ins_level1 WHERE name = 'Cho thuê'), 2, '')
    ('Nhà trọ, phòng trọ', (SELECT id FROM ins_level1 WHERE name = 'Cho thuê'), 2, '')
    ('Văn phòng, mặt bằng', (SELECT id FROM ins_level1 WHERE name = 'Cho thuê'), 2, '')
    ('Nhà xưởng, kho, đất', (SELECT id FROM ins_level1 WHERE name = 'Cho thuê'), 2, '')
  RETURNING id, name
),

-- CTE for level 3 categories under Computers
ins_level3_comp AS (
  INSERT INTO categories (name, parent_id, level, note) VALUES
    ('Nhà mặt tiền', (SELECT id FROM ins_level2 WHERE name = 'Bán nhà'), 3, ''),
    ('Nhà hẻm, ngõ', (SELECT id FROM ins_level2 WHERE name = 'Bán nhà'), 3, '')
    ('Biệt thự, Villa', (SELECT id FROM ins_level2 WHERE name = 'Bán nhà'), 3, '')
  RETURNING id, name
),

-- Select statement to execute all CTEs
SELECT * FROM ins_level1
UNION ALL
SELECT * FROM ins_level2
UNION ALL
SELECT * FROM ins_level3_comp
UNION ALL
SELECT * FROM ins_level3_phone;