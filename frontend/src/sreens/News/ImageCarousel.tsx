import { useEffect, useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type ImageCarouselProps = {
    images: string[];
    postId: string;
    initialIndex?: number;
};

const ImageCarousel = ({ images, postId, initialIndex = 0 }: ImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentImageIndex(initialIndex);
  }, [initialIndex, images]);

  const handleSwipe = () => {
    if (!carouselRef.current || !isSwiping) return;
    
    const containerWidth = carouselRef.current.offsetWidth;
    const threshold = containerWidth * 0.5;
    const currentOffset = swipeOffset;
    
    requestAnimationFrame(() => {
      if (Math.abs(currentOffset) > threshold) {
        const direction = currentOffset > 0 ? -1 : 1;
        setCurrentImageIndex(prev => {
          const newIndex = prev + direction;
          return Math.max(0, Math.min(images.length - 1, newIndex));
        });
      }
      
      setSwipeOffset(0);
      setIsSwiping(false);
    });
  };

  return (
    <div 
      ref={carouselRef}
      className="image-carousel"
      onTouchStart={(e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setIsSwiping(true);
      }}
      onTouchMove={(e) => {
        if (!isSwiping) return;
        const delta = e.targetTouches[0].clientX - touchStart;
        setSwipeOffset(delta);
      }}
      onTouchEnd={handleSwipe}
      onTouchCancel={handleSwipe}
    >
      <div className="carousel-inner">
        <div 
          className="carousel-track"
          style={{ 
            transform: `translateX(calc(-${currentImageIndex * 100}% + ${swipeOffset}px)`,
            transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          {images.map((img, index) => (
            <div key={index} className="carousel-item">
              <img src={img} className="post-image" alt={`Content ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        {currentImageIndex > 0 && (
          <button className="arrow left" onClick={() => setCurrentImageIndex(prev => prev - 1)}>
            <FiChevronLeft />
          </button>
        )}
        {currentImageIndex < images.length - 1 && (
          <button className="arrow right" onClick={() => setCurrentImageIndex(prev => prev + 1)}>
            <FiChevronRight />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="image-counter">
            {currentImageIndex + 1} / {images.length}
        </div>
       )}
    </div>
  );
};

export default ImageCarousel;