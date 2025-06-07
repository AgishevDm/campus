CREATE TABLE chat (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    isgroup BOOLEAN DEFAULT false,
    creatorid UUID NOT NULL,
    createtime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    lastactivity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    isarchived BOOLEAN DEFAULT false,
    CONSTRAINT fk_chat_creator FOREIGN KEY (creatorid) REFERENCES accounts(primarykey)
);

CREATE TABLE chatparticipant (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chatid UUID NOT NULL,
    userid UUID NOT NULL,
    CONSTRAINT fk_chat_part_chat FOREIGN KEY (chatid) REFERENCES chat(primarykey),
    CONSTRAINT fk_chat_part_user FOREIGN KEY (userid) REFERENCES accounts(primarykey),
    UNIQUE(chatid, userid)
);

CREATE TABLE message (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chatid UUID NOT NULL,
    senderid UUID NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_chat FOREIGN KEY (chatid) REFERENCES chat(primarykey),
    CONSTRAINT fk_message_sender FOREIGN KEY (senderid) REFERENCES accounts(primarykey)
);
