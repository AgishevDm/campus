CREATE TABLE news (
  primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  typenews VARCHAR(255),
  createdby VARCHAR(255) NOT NULL,
  locationmap VARCHAR(255),
  dateevent TIMESTAMP,
  advertisingurl VARCHAR(255),
  description TEXT,
  likescount INTEGER NOT NULL DEFAULT 0,
  createtime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edittime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  picture VARCHAR(255),
  
  CONSTRAINT fk_account
    FOREIGN KEY (createdby) 
    REFERENCES account(primarykey)
);