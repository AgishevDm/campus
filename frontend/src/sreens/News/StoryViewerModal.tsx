import { useEffect, useState, useRef, CSSProperties } from 'react';
import { CgClose, CgMoreO } from 'react-icons/cg';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './StoryViewerModal.scss';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

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
      textElements?: TextElement[]; // Добавляем поле
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

type StoryViewerProps = {
  stories: Story[];
  currentIndex: number;
  onClose: () => void;
  onStoryEnd?: () => void;
};

const DEFAULT_METADATA = {
    adjustments: { brightness: 100, contrast: 100, saturation: 100, hue: 0 },
    rotation: 0,
    isFlipped: false,
    position: { x: 0, y: 0 },
    scale: 1,
    textElements: [],
};

export default function StoryViewerModal({ stories, currentIndex, onClose, onStoryEnd }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(Math.min(currentIndex, stories.length - 1));
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hoverSide, setHoverSide] = useState<'left'|'right'|null>(null);
  
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseDurationRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStory = stories[currentStoryIndex] || {};
  const metadata = currentStory.metadata || DEFAULT_METADATA;

  // Timer logic
  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current - pauseDurationRef.current;
      const newProgress = (elapsed / 5000) * 100;
      
      if (newProgress >= 100) handleNext();
      else setProgress(newProgress);
    }, 50);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      pauseDurationRef.current += Date.now() - (startTimeRef.current || 0);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else {
      setCurrentStoryIndex(stories.length - 1);
      setProgress(0);
    }
  };

  // Event handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverSide(x < rect.width / 2 ? 'left' : 'right');
  };

  const handleTouch = (e: React.TouchEvent) => {
    const touchX = e.touches[0].clientX;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    if (touchX < rect.left + rect.width / 2) handlePrev();
    else handleNext();
  };

  // Effects
  useEffect(() => {
    if (!isPaused) startTimer();
    return () => { timerRef.current && clearInterval(timerRef.current); };
  }, [currentStoryIndex, isPaused]);

  if (!stories.length) return null;

  return (
    <div className="story-viewer-overlay-svm">
      <div className="story-viewer-container-svm">
        {/* Progress bars */}
        <div className="progress-bars-svm">
          {stories.map((_, i) => (
            <div key={i} className="progress-track-svm">
              <div 
                className={`progress-fill-svm ${i === currentStoryIndex ? 'active' : ''}`}
                style={{ width: i === currentStoryIndex ? `${progress}%` : i < currentStoryIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Story content with text elements */}
        <div className="preview-container-svm">
          <img
            className="story-image-svm"
            src={currentStory.preview}
            style={{
              filter: `brightness(${metadata.adjustments?.brightness || 100}%) 
                contrast(${metadata.adjustments?.contrast || 100}%) 
                saturate(${metadata.adjustments?.saturation || 100}%) 
                hue-rotate(${metadata.adjustments?.hue || 0}deg)`,
            }}
            alt="Story content"
          />
          
          {metadata.textElements?.map((text: TextElement) => (
            <div
                key={text.id}
                style={{
                position: 'absolute',
                left: `${text.position.x}px`,
                top: `${text.position.y}px`,
                transform: `scale(${text.scale}) rotate(${text.rotation}deg)`,
                color: text.color,
                fontFamily: text.fontFamily,
                fontWeight: text.isBold ? 'bold' : 'normal',
                fontStyle: text.isItalic ? 'italic' : 'normal',
                textDecoration: text.isUnderlined ? 'underline' : 'none',
                textAlign: text.alignment,
                pointerEvents: 'none',
                maxWidth: '80%',
                wordBreak: 'break-word',
                }}
            >
                {text.content}
            </div>
            ))}
        </div>

        {/* Navigation controls */}
        <div className="nav-area-left" onClick={handlePrev} />
        <div className="nav-area-right" onClick={handleNext} />

        {hoverSide === 'left' && (
          <button className="nav-btn-svm prev hover-visible" onClick={handlePrev}>
            <FiChevronLeft size={24} />
          </button>
        )}
        {hoverSide === 'right' && (
          <button className="nav-btn-svm next hover-visible" onClick={handleNext}>
            <FiChevronRight size={24} />
          </button>
        )}

        {/* Header */}
        <div className="header-info-svm">
          <div className="author-info-svm">
            <img 
              src={currentStory.author.avatar} 
              className="avatar-svm" 
              alt={currentStory.author.username} 
            />
            <div className="details-svm">
              <span className="username-svm">{currentStory.author.username}</span>
              <span className="timestamp-svm">
                {formatDistanceToNow(currentStory.createdAt, { locale: ru, addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-actions-svm">
          <span className="views-svm">{currentStory.views} просмотров</span>
          <button 
            className={`like-btn-svm ${isLiked ? 'liked' : ''}`}
            onClick={() => setIsLiked(!isLiked)}
            aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        {/* Close button */}
        <button className="close-btn-svm" onClick={onClose} aria-label="Закрыть">
          <CgClose size={24} />
        </button>
      </div>
    </div>
  );
}