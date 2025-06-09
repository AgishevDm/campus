import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './News.scss';
import ImageCarousel from './ImageCarousel';
import { Post } from './types';

export default function PublicPost() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/news/public/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost({
            id: data.id,
            type: data.typeNews,
            title: data.title,
            author: data.createdBy,
            authorId: data.authorId,
            avatar: data.avatar,
            location: data.locationMap || '',
            images: data.images || [],
            text: data.description || '',
            date: data.createTime ? new Date(data.createTime).toLocaleDateString('ru-RU') : '',
            isFavorite: false,
            eventDate: data.dateEvent ? new Date(data.dateEvent).toISOString().split('T')[0] : undefined,
            eventTime: data.dateEvent ? new Date(data.dateEvent).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}) : undefined,
            link: data.advertisingUrl,
            likes: data.likesCount || 0,
            liked: false,
            expanded: false,
            showComments: false,
            commentsCount: 0,
            shareCount: data.shareCount || 0
          });
        }
      } catch(e) {
        console.error(e);
      }
    };
    load();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="news-container">
      <div className="posts-list">
        <div className="post post-public">
          <div className="post-header">
            <div className="author-info">
              <img src={post.avatar} className="avatar" alt="avatar" />
              <div><h3>{post.author}</h3></div>
            </div>
          </div>
          <h4 className="post-title">{post.title}</h4>
          {post.images.length > 0 && (
            <div className="image-container">
              <ImageCarousel images={post.images} postId={post.id} />
            </div>
          )}
          <div className="post-content">
            {post.text.split('\n').map((l,i)=>(<p key={i}>{l}</p>))}
          </div>
        </div>
        <div style={{marginTop:'20px', textAlign:'center'}}>
          <Link to="/login">Войти для просмотра других новостей</Link>
        </div>
      </div>
    </div>
  );
}
