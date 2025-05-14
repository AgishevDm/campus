import { useState, useEffect } from 'react';
import './Stories.scss';
import { CgAddR } from 'react-icons/cg';
import CreateStoryModal from './CreateStoryModal';
import StoryViewerModal from './StoryViewerModal';
import { CurrentUser } from './types';

type StoriesProps = {
    currentUser: CurrentUser;
  };

type Story = {
  id: string;
  preview: string;
  createdAt: Date;
  author: {
    username: string;
    avatar: string;
  };
  views: number;
  hasStory: boolean;
  isSeen: boolean;
  metadata?: {
    adjustments: any;
    rotation: number;
    isFlipped: boolean;
    position: { x: number; y: number };
    scale: number;
  };
};

export default function Stories({ currentUser }: StoriesProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [viewingStories, setViewingStories] = useState<Story[]>([]);
  const [currentViewingIndex, setCurrentViewingIndex] = useState(0);

  // Пример начальных историй
  const initialStories: Story[] = [
    {
      id: '1',
      preview: 'https://picsum.photos/400/800',
      createdAt: new Date(Date.now() - 3600000),
      author: { 
        username: 'user1', 
        avatar: 'https://i.pravatar.cc/100' 
      },
      views: 123,
      hasStory: true,
      isSeen: false,
      metadata: {
        adjustments: { 
          brightness: 100, 
          contrast: 100, 
          saturation: 100, 
          hue: 0 
        },
        rotation: 0,
        isFlipped: false,
        position: { x: 0, y: 0 },
        scale: 1
      }
    },
    {
      id: '2',
      preview: 'https://picsum.photos/401/800',
      createdAt: new Date(Date.now() - 7200000),
      author: { 
        username: 'user2', 
        avatar: 'https://i.pravatar.cc/101' 
      },
      views: 89,
      hasStory: true,
      isSeen: false
    }
  ];

  const [stories, setStories] = useState<Story[]>(initialStories);

  const handlePublishStory = async (formData: FormData) => {
    const newStory: Story = {
        id: Date.now().toString(),
        preview: URL.createObjectURL(formData.get('file') as File),
        createdAt: new Date(),
        author: { 
          username: currentUser.accountFIO,
          avatar: currentUser.avatarURL 
        },
      views: 0,
      hasStory: true,
      isSeen: false,
      metadata: JSON.parse(formData.get('metadata') as string)
    };
    
    setUserStories(prev => [newStory, ...prev]);
    setShowCreateModal(false);
  };

  const handleStoryClick = (clickedIndex: number) => {
    const allStories = [...userStories, ...stories];
    const availableStories = allStories.filter(s => s.hasStory);
    setViewingStories(availableStories);
    setCurrentViewingIndex(clickedIndex);
  };

  const markStoryAsSeen = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId ? { ...story, isSeen: true } : story
    ));
    
    setUserStories(prev => prev.map(story => 
      story.id === storyId ? { ...story, isSeen: true } : story
    ));
  };

  return (
    <div className="stories-section">
      <div className="stories-container">
        <div className="stories-scroll">
          {/* Кнопка создания новой истории */}
          <div 
            className="story-item create-story" 
            onClick={() => setShowCreateModal(true)}
          >
            <div className="story-avatar add-story">
              <CgAddR className="add-icon" />
            </div>
            <span className="story-username">Your Story</span>
          </div>

          {/* Список историй */}
          {[...userStories, ...stories].map((story, index) => (
            <div 
              key={story.id}
              className={`story-item ${story.isSeen ? 'seen' : ''}`}
              onClick={() => {
                handleStoryClick(index);
                markStoryAsSeen(story.id);
              }}
            >
              <div className="story-avatar has-story">
                <img 
                  src={story.author.avatar} 
                  alt={story.author.username} 
                  className="avatar-image"
                />
              </div>
              <span className="story-username">
                {story.author.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно создания истории */}
      {showCreateModal && (
        <CreateStoryModal
          onClose={() => setShowCreateModal(false)}
          onPublish={handlePublishStory}
        />
      )}

      {/* Модальное окно просмотра историй */}
      {viewingStories.length > 0 && (
        <StoryViewerModal
          stories={viewingStories}
          currentIndex={currentViewingIndex}
          onClose={() => setViewingStories([])}
        />
      )}
    </div>
  );
}