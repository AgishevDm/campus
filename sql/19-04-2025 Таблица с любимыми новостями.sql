create table favoriteNews (
    primarykey UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES accounts(primarykey),
    newsId UUID REFERENCES news(primarykey)
)