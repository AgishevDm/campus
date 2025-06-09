import { useState, useEffect } from 'react';
import './Stories.scss';
import { CgAddR } from 'react-icons/cg';
import CreateStoryModal from './CreateStoryModal';
import StoryViewerModal from './StoryViewerModal';
import { CurrentUser } from './types';

type Story = {
  id: string;
  preview: string;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  views: number;
  hasStory: boolean;
  isSeen: boolean;
  metadata?: {
    adjustments?: {
      brightness?: number;
      contrast?: number;
      saturation?: number;
      hue?: number;
    };
    rotation?: number;
    isFlipped?: boolean;
    position?: { x: number; y: number };
    scale?: number;
    textElements?: TextElement[];
  };
};

type TextElement = {
    id: string;
    content: string;
    position: { x: number; y: number };
    scale: number;
    rotation: number;
    color: string;
    fontFamily: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderlined: boolean;
    alignment: 'left' | 'center' | 'right';
};

type UserStoriesGroup = {
  userId: string;
  username: string;
  avatar: string;
  stories: Story[];
  isSeen: boolean;
};

export default function Stories({ currentUser, isLoading }: { currentUser: CurrentUser; isLoading: boolean }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userStories, setUserStories] = useState<UserStoriesGroup[]>([]);
  const [viewingStories, setViewingStories] = useState<Story[]>([]);
  const [currentViewingIndex, setCurrentViewingIndex] = useState(0);
  const [currentUserGroupIndex, setCurrentUserGroupIndex] = useState(0);

  // Initial mock data
  const initialStories: Story[] = [
    {
      id: '1',
      preview: 'https://picsum.photos/400/800',
      createdAt: new Date(Date.now() - 3600000),
      author: { 
        id: 'user1',
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
        scale: 1,
        textElements: [
          {
            id: 'text1',
            content: 'Пример текста',
            position: { x: 100, y: 200 },
            scale: 1,
            rotation: 0,
            color: '#FFFFFF',
            fontFamily: 'Arial',
            isBold: false,
            isItalic: false,
            isUnderlined: false,
            alignment: 'center'
          }
        ]
      }
    },
    {
      id: '2',
      preview: 'https://picsum.photos/401/800',
      createdAt: new Date(Date.now() - 7200000),
      author: { 
        id: 'user2',
        username: 'user2', 
        avatar: 'https://i.pravatar.cc/101' 
      },
      views: 89,
      hasStory: true,
      isSeen: false
    }
  ];

  const [stories, setStories] = useState<Story[]>(initialStories);
  const [groupedStories, setGroupedStories] = useState<UserStoriesGroup[]>([]);

  // Group stories by user
  const groupStoriesByUser = (stories: Story[]): UserStoriesGroup[] => {
    const groups: { [key: string]: UserStoriesGroup } = {};
    
    stories.forEach(story => {
      if (!groups[story.author.id]) {
        groups[story.author.id] = {
          userId: story.author.id,
          username: story.author.username,
          avatar: story.author.avatar,
          stories: [],
          isSeen: false
        };
      }
      groups[story.author.id].stories.push(story);
      // Group is seen only if all stories are seen
      groups[story.author.id].isSeen = groups[story.author.id].stories.every(s => s.isSeen);
    });
    
    // Sort - unseen first, then seen
    return Object.values(groups).sort((a, b) => 
      a.isSeen === b.isSeen ? 0 : a.isSeen ? 1 : -1
    );
  };

  useEffect(() => {
    setGroupedStories(groupStoriesByUser([...userStories.flatMap(g => g.stories), ...stories]));
  }, [userStories, stories]);

  const handlePublishStory = async (formData: FormData) => {
    const newStory: Story = {
      id: Date.now().toString(),
      preview: URL.createObjectURL(formData.get('file') as File),
      createdAt: new Date(),
      author: { 
        id: currentUser.id,
        username: currentUser.accountFIO,
        avatar: currentUser.avatarURL 
      },
      views: 0,
      hasStory: true,
      isSeen: false,
      metadata: JSON.parse(formData.get('metadata') as string)
    };
    
    setUserStories(prev => {
      const existingGroup = prev.find(g => g.userId === currentUser.id);
      if (existingGroup) {
        return prev.map(g => g.userId === currentUser.id ? 
          { ...g, stories: [newStory, ...g.stories], isSeen: false } : g
        );
      }
      return [...prev, { 
        userId: currentUser.id,
        username: currentUser.accountFIO,
        avatar: currentUser.avatarURL,
        stories: [newStory], 
        isSeen: false 
      }];
    });
    setShowCreateModal(false);
  };

  const handleStoryClick = (groupIndex: number) => {
    const group = groupedStories[groupIndex];
    setViewingStories(group.stories);
    setCurrentUserGroupIndex(groupIndex);
    setCurrentViewingIndex(0);
  };

  const markStoriesAsSeen = (userId: string) => {
    setGroupedStories(prev => 
      prev.map(g => g.userId === userId ? 
        { ...g, isSeen: true, stories: g.stories.map(s => ({ ...s, isSeen: true })) } : g
      ).sort((a, b) => a.isSeen === b.isSeen ? 0 : a.isSeen ? 1 : -1)
    );
  };

  const handleStoryViewerClose = () => {
    if (viewingStories.length > 0) {
      markStoriesAsSeen(viewingStories[0].author.id);
    }
    setViewingStories([]);
  };

  const handleStoryEnd = () => {
    if (currentViewingIndex === viewingStories.length - 1) {
      markStoriesAsSeen(viewingStories[0].author.id);
    }
  };

  return (
    <div className="stories-section">
      <div className="stories-container">
        <div className="stories-scroll">
          {/* Create story button */}
          <div 
            className="story-item create-story" 
            onClick={() => setShowCreateModal(true)}
          >
            <div className="story-avatar add-story">
              <CgAddR className="add-icon" />
            </div>
            <span className="story-username">Your Story</span>
          </div>

          {/* Stories list */}
          {isLoading ? (
            [...Array(5)].map((_, idx) => (
              <div key={idx} className="story-item skeleton">
                <div className="story-avatar" />
                <span className="story-username" />
              </div>
            ))
          ) : (
            groupedStories.map((group, index) => (
              <div
                key={group.userId}
                className={`story-item ${group.isSeen ? 'seen' : ''}`}
                onClick={() => handleStoryClick(index)}
              >
                <div className={`story-avatar ${group.isSeen ? '' : 'has-story'}`}> 
                  <img
                    src={group.avatar}
                    alt={group.username}
                    className="avatar-image"
                  />
                </div>
                <span className="story-username">
                  {group.username}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create story modal */}
      {showCreateModal && (
        <CreateStoryModal
          onClose={() => setShowCreateModal(false)}
          onPublish={handlePublishStory}
        />
      )}

      {/* Story viewer modal */}
      {viewingStories.length > 0 && (
        <StoryViewerModal
          stories={viewingStories}
          currentIndex={currentViewingIndex}
          onClose={handleStoryViewerClose}
          onStoryEnd={handleStoryEnd}
        />
      )}
    </div>
  );
}