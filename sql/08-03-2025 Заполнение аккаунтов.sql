INSERT INTO typeaccess (type, createtime, edittime) 
VALUES 
    ('user', NOW(), NOW()), 
    ('admin', NOW(), NOW());

-- Первая вставка записей
INSERT INTO accounts (email, login, password, createtime, edittime, typeaccess) 
VALUES 
    ('ani.tokar2@yandex.ru', 'anitokar', '$2a$12$R7imbYo.sJT2H4yenwvraOKJElci.d/QMd.Q47HivnqyHIg05y182', NOW(), NOW(),'f8815373-78f5-4fa3-b38d-bddb3f574071'), 
    ('n.vershinin@yandex.ru', 'nvershinin', '$2a$12$R7imbYo.sJT2H4yenwvraOKJElci.d/QMd.Q47HivnqyHIg05y182', NOW(), NOW(),'f8815373-78f5-4fa3-b38d-bddb3f574071'),
    ('d.agishev@yandex.ru', 'dagishev', '$2a$12$R7imbYo.sJT2H4yenwvraOKJElci.d/QMd.Q47HivnqyHIg05y182', NOW(), NOW(),'f8815373-78f5-4fa3-b38d-bddb3f574071'),
    ('n.mosdacova@yandex.ru', 'nmosdacova', '$2a$12$R7imbYo.sJT2H4yenwvraOKJElci.d/QMd.Q47HivnqyHIg05y182', NOW(), NOW(),'f8815373-78f5-4fa3-b38d-bddb3f574071');

-- Вставка с рекурсивным CTE
WITH RECURSIVE generate_users AS (
    SELECT 1 AS user_id
    UNION ALL
    SELECT user_id + 1
    FROM generate_users
    WHERE user_id < 30
)
INSERT INTO accounts (email, login, password, createtime, edittime, typeaccess)
SELECT 
    'user' || user_id || '@example.com',  -- Формат email
    'test_' || user_id,                     -- Формат login
    '$2a$12$R7imbYo.sJT2H4yenwvraOKJElci.d/QMd.Q47HivnqyHIg05y182',                     -- Хешированный пароль (замените на реальный хеш)
    NOW(),                                  -- Время создания
    NOW(),
    'c328fac9-5db8-415b-a12c-f9115389e370'
FROM generate_users;

--Добавить супер пользователей
INSERT INTO accounts (email, login, password, createtime, edittime, ussuperuser, typeaccess) 
VALUES 
    ('test_superuser@yandex.ru', 'test_superuser', '$2a$12$R7imbYo.sJT2H4yenwvraOKJElci.d/QMd.Q47HivnqyHIg05y182', NOW(), NOW(), True, 'c328fac9-5db8-415b-a12c-f9115389e370'), 
    ('test_superuser2@yandex.ru', 'test_superuser2', '$2a$12$R7imbYo.sJT2H4yenwvraOKJElci.d/QMd.Q47HivnqyHIg05y182', NOW(), NOW(), True, 'c328fac9-5db8-415b-a12c-f9115389e370'),
    ('test_superuser3@yandex.ru', 'test_superuser3', '$2a$12$R7imbYo.sJT2H4yenwvraOKJElci.d/QMd.Q47HivnqyHIg05y182', NOW(), NOW(), True, 'c328fac9-5db8-415b-a12c-f9115389e370'),
    ('test_superuser4@yandex.ru', 'test_superuser4', '$2a$12$R7imbYo.sJT2H4yenwvraOKJElci.d/QMd.Q47HivnqyHIg05y182', NOW(), NOW(), True, 'c328fac9-5db8-415b-a12c-f9115389e370');

--DELETE FROM accounts;
--DELETE FROM accounts WHERE login='test_superuser'
--DELETE FROM accounts WHERE login='test_superuser2'
--DELETE FROM accounts WHERE login='test_superuser3'
--DELETE FROM accounts WHERE login='test_superuser4'

--DELETE FROM accounts WHERE login='anitokar'
--DELETE FROM accounts WHERE login='nvershinin'
--DELETE FROM accounts WHERE login='dagishev'
--DELETE FROM accounts WHERE login='nmosdacova'
--Удалить 30 тестовых пользователей
DELETE FROM accounts
WHERE login = ANY(ARRAY['test_1', 'test_2', 'test_3', 'test_4', 'test_5', 'test_6', 
   'test_7', 'test_8', 'test_9', 'test_10', 'test_11', 'test_12', 
    'test_13', 'test_14', 'test_15', 'test_16', 'test_17', 'test_18', 
    'test_19', 'test_20', 'test_21', 'test_22', 'test_23', 'test_24', 
    'test_25', 'test_26', 'test_27', 'test_28', 'test_29', 'test_30']);