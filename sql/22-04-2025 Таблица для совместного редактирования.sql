CREATE TABLE IF NOT EXISTS noteshare (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    noteid UUID NOT NULL REFERENCES note(primarykey),
    accountid UUID NOT NULL REFERENCES accounts(primarykey),
    access VARCHAR(10) CHECK(access IN ('VIEW', 'EDIT')),
    createtime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (noteid, accountid)
);