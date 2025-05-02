CREATE TABLE note (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL,
    history JSONB NULL,
    listtype VARCHAR(50) DEFAULT 'none',
    accountid UUID NOT NULL,
    createat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updateat TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_account
        FOREIGN KEY (accountid) 
        REFERENCES accounts(primarykey)
        ON DELETE CASCADE
);

-- Создание индекса для ускорения поиска по accountid
CREATE INDEX idx_note_accountid ON note(accountid);
CREATE INDEX idx_note_content ON note USING GIN (content jsonb_path_ops);