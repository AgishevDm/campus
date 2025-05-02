create table feetback (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text,
    userId UUID,
    message text,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isCheck BOOLEAN DEFAULT false,
    isDeleted BOOLEAN DEFAULT false,
    document text,

    CONSTRAINT fk_user
        FOREIGN KEY (userId)
        REFERENCES accounts(primarykey)
        ON DELETE SET NULL
);

CREATE INDEX idx_feetback_userId ON feetback(userId);

drop table feetback;