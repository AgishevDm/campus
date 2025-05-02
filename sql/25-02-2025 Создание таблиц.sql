-- Устанавливаем расширение для работы с UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица факультетов
CREATE TABLE faculties(
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar (255),
    shortname varchar(20)
)

-- Таблица типов доступа
CREATE TABLE typeAccess (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица пользователей
CREATE TABLE accounts (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NULL,
    login VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    accountFIO VARCHAR(255),
    speciality varchar (20),
    faculties UUID REFERENCES faculties(primarykey),
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usSuperUser bool,
    typeAccess UUID REFERENCES typeAccess(primarykey),
    avatarUrl TEXT
);

-- Индексы для ускорения поиска
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_login ON accounts(login);


-- Таблица зданий
CREATE TABLE buildings (
    primaryKey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

-- Индекс для ускорения поиска по названию здания
CREATE INDEX idx_buildings_name ON buildings(name);


-- Таблица кабинетов
CREATE TABLE rooms (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building UUID REFERENCES buildings(primaryKey),
    number_name VARCHAR(50) NULL,
    type VARCHAR(50),
    rate DECIMAL(10,2),
    description TEXT
);

-- Индекс для ускорения поиска по номеру кабинетов
CREATE INDEX idx_rooms_number_name ON rooms(number_name);


-- Таблица календаря
CREATE TABLE calendar (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account UUID REFERENCES accounts(primarykey),
    event VARCHAR(255) NOT NULL,
    eventType VARCHAR(50) NOT NULL
);

-- Индексы для ускорения поиска
CREATE INDEX idx_calendar_event ON calendar(event);
CREATE INDEX idx_calendar_event_type ON calendar(eventType);


-- Таблица событий пользователей
CREATE TABLE accountEvents (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calendar UUID REFERENCES calendar(primarykey),
    account UUID REFERENCES accounts(primarykey),
    eventName DATE NOT NULL,
    startEvent TIMESTAMP NOT NULL,
    remindTime TIMESTAMP,
    isRecurring BOOLEAN DEFAULT FALSE,
    patternRecurring VARCHAR(50),
    description TEXT
);

-- Индекс для ускорения поиска по имени события
CREATE INDEX idx_account_events_event_name ON accountEvents(eventName);


-- Таблица расписания
CREATE TABLE shedule (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calendar UUID REFERENCES calendar(primarykey),
    name VARCHAR(255) NOT NULL,
    startTime TIMESTAMP NULL,
    endTime TIMESTAMP NULL,
    place VARCHAR(255),
    description TEXT
);

-- Индекс для ускорения поиска по названию расписания
CREATE INDEX idx_schedules_name ON shedule(name);

-- Удаление таблиц и связанных объектов

-- Сначала удаляем внешние ключи, чтобы избежать ошибок
ALTER TABLE accounts DROP CONSTRAINT accounts_typeaccess_fkey;
ALTER TABLE rooms DROP CONSTRAINT rooms_building_fkey;
ALTER TABLE calendar DROP CONSTRAINT calendar_account_fkey;
ALTER TABLE accountEvents DROP CONSTRAINT accountevents_calendar_fkey;
ALTER TABLE accountEvents DROP CONSTRAINT accountevents_account_fkey;
ALTER TABLE shedule DROP CONSTRAINT shedule_calendar_fkey;

-- Удаление таблиц
DROP TABLE shedule;
DROP TABLE accountEvents;
DROP TABLE calendar;
DROP TABLE rooms;
DROP TABLE buildings;
DROP TABLE typeAccess;
DROP TABLE faculties;
DROP TABLE accounts;
-- Удаление индексов
DROP INDEX idx_schedules_name;
DROP INDEX idx_account_events_event_name;
DROP INDEX idx_calendar_event_type;
DROP INDEX idx_calendar_event;
DROP INDEX idx_rooms_number_name;
DROP INDEX idx_buildings_name;
DROP INDEX idx_accounts_login;
DROP INDEX idx_accounts_email;

-- Удаление расширения
DROP EXTENSION IF EXISTS "uuid-ossp";