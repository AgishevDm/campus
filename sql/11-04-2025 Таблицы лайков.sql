CREATE TABLE public.news_likes (
    primarykey UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    postid UUID NOT NULL,
    userid UUID NOT NULL,
    createtime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Внешние ключи
    CONSTRAINT fk_post FOREIGN KEY (postid) REFERENCES public.news(primarykey) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES public.accounts(primarykey) ON DELETE CASCADE,
    
    -- Уникальный индекс для пары postid+userid
    CONSTRAINT unique_like UNIQUE (postid, userid)
);

-- Создаем индекс для ускорения поиска лайков по пользователю
CREATE INDEX idx_news_likes_userid ON public.news_likes(userid);

-- Создаем индекс для ускорения поиска лайков по посту
CREATE INDEX idx_news_likes_postid ON public.news_likes(postid);