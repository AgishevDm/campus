import { useState, useRef, useEffect, useCallback } from 'react';
import { CgClose, CgFormatLeft, CgFormatCenter, CgFormatRight } from 'react-icons/cg';
import { FiDownloadCloud, FiBold, FiItalic, FiUnderline } from 'react-icons/fi';
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { GoMirror } from "react-icons/go";
import { TbTextSize } from "react-icons/tb";
import { FaTimes } from "react-icons/fa";
import './CreateStoryModal.scss';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

type StoryEditorProps = {
  onClose: () => void;
  onPublish: (storyData: FormData) => void;
};

type Adjustment = {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  shadows: number;
  blur: number;
};

type Position = {
  x: number;
  y: number;
};

type TextElement = {
  id: string;
  content: string;
  position: Position;
  scale: number;
  rotation: number;
  color: string;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderlined: boolean;
  alignment: 'left' | 'center' | 'right';
  isActive: boolean;
};

const FONT_OPTIONS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Impact',
  'Comic Sans MS'
];

const COLOR_OPTIONS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#800080'
];

const TextElementComponent = ({
  text,
  updateText,
  removeText,
  updateTextStyle,
  scale
}: {
  text: TextElement;
  updateText: (content: string) => void;
  removeText: () => void;
  updateTextStyle: (style: Partial<TextElement>) => void;
  scale: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(text.position);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x * scale,
      y: e.clientY - position.y * scale
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = (e.clientX - dragStart.x) / scale;
    const newY = (e.clientY - dragStart.y) / scale;
    
    setPosition({ x: newX, y: newY });
    updateTextStyle({ position: { x: newX, y: newY } });
  }, [isDragging, dragStart, scale, updateTextStyle]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`text-element ${text.isActive ? 'active' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scale(${text.scale}) rotate(${text.rotation}deg)`,
        color: text.color,
        fontFamily: text.fontFamily,
        fontWeight: text.isBold ? 'bold' : 'normal',
        fontStyle: text.isItalic ? 'italic' : 'normal',
        textDecoration: text.isUnderlined ? 'underline' : 'none',
        textAlign: text.alignment,
        cursor: isDragging ? 'grabbing' : 'move',
        padding: '10px',
        maxWidth: '80%',
        wordBreak: 'break-word'
      }}
      onMouseDown={handleMouseDown}
      contentEditable={text.isActive}
      suppressContentEditableWarning
      onBlur={(e) => updateText(e.currentTarget.textContent || '')}
    >
      {text.content}
      {text.isActive && (
        <button
          className="text-remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            removeText();
          }}
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default function CreateStoryModal({ onClose, onPublish }: StoryEditorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [adjustments, setAdjustments] = useState<Adjustment>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    shadows: 0,
    blur: 0
  });
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [isTextMode, setIsTextMode] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    corrections: false,
    text: false
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const touchStartPos = useRef<Position>({ x: 0, y: 0 });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        calculateScaleAndPosition(img);
        setPreview(e.target?.result as string);
        setFile(file);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const calculateScaleAndPosition = (img: HTMLImageElement) => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const scaleX = containerWidth / img.width;
    const scaleY = containerHeight / img.height;
    const scaleFactor = Math.min(scaleX, scaleY);
    
    setScale(scaleFactor);
    setPosition({
      x: (containerWidth - img.width * scaleFactor) / 2 / scaleFactor,
      y: (containerHeight - img.height * scaleFactor) / 2 / scaleFactor
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!preview || !containerRef.current) return;
    
    if (isTextMode) {
      if (!(e.target as HTMLElement).classList.contains('text-element')) {
        setIsTextMode(false);
        setActiveTextId(null);
      }
      return;
    }
    
    e.preventDefault();
    
    isDraggingRef.current = true;
    dragStartPos.current = { 
      x: e.clientX - position.x * scale, 
      y: e.clientY - position.y * scale 
    };
    
    if (imageRef.current) {
      imageRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current || !imageRef.current) return;
    
    const newX = (e.clientX - dragStartPos.current.x) / scale;
    const newY = (e.clientY - dragStartPos.current.y) / scale;
    
    setPosition({ x: newX, y: newY });
  }, [scale]);

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (imageRef.current) {
      imageRef.current.style.cursor = 'grab';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!preview || !containerRef.current) return;
    
    const touch = e.touches[0];
    isDraggingRef.current = true;
    touchStartPos.current = {
      x: touch.clientX - position.x * scale,
      y: touch.clientY - position.y * scale
    };
    
    if (imageRef.current) {
      imageRef.current.style.cursor = 'grabbing';
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current || !containerRef.current || !imageRef.current) return;
    
    const touch = e.touches[0];
    const newX = (touch.clientX - touchStartPos.current.x) / scale;
    const newY = (touch.clientY - touchStartPos.current.y) / scale;
    
    setPosition({ x: newX, y: newY });
  }, [scale]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove as any);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove as any);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleTouchMove]);

  const rotateImage = (angle: number) => {
    setRotation(prev => (prev + angle) % 360);
  };

  const resetImagePosition = () => {
    if (!file || !imageRef.current) return;
    calculateScaleAndPosition(imageRef.current);
    setRotation(0);
    setIsFlipped(false);
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0,
      shadows: 0,
      blur: 0
    });
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  const handleAddText = () => {
    if (!containerRef.current) return;
    
    const newText: TextElement = {
      id: Date.now().toString(),
      content: 'Нажмите для редактирования',
      position: { x: 100, y: 100 },
      scale: 1,
      rotation: 0,
      color: '#FFFFFF',
      fontFamily: 'Arial',
      isBold: false,
      isItalic: false,
      isUnderlined: false,
      alignment: 'center',
      isActive: true
    };
    
    setTextElements(prev => [...prev, newText]);
    setActiveTextId(newText.id);
    setIsTextMode(true);
    
    setTimeout(() => {
      const textElement = document.querySelector(`[data-text-id="${newText.id}"]`) as HTMLElement;
      if (textElement) {
        textElement.focus();
      }
    }, 0);
  };

  const handleTextClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (e.detail === 2) {
      setActiveTextId(id);
      setIsTextMode(true);
      
      setTimeout(() => {
        const textElement = document.querySelector(`[data-text-id="${id}"]`) as HTMLElement;
        if (textElement) {
          textElement.focus();
        }
      }, 0);
    }
  };

  const handleTextChange = (id: string, content: string) => {
    setTextElements(prev =>
      prev.map(text =>
        text.id === id ? { ...text, content } : text
      )
    );
  };

  const updateTextStyle = (id: string, style: Partial<TextElement>) => {
    setTextElements(prev =>
      prev.map(text =>
        text.id === id ? { ...text, ...style } : text
      )
    );
  };

  const removeText = (id: string) => {
    setTextElements(prev => prev.filter(text => text.id !== id));
    if (activeTextId === id) {
      setActiveTextId(null);
      setIsTextMode(false);
    }
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePublish = async () => {
    if (!file || !preview || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Устанавливаем размеры canvas в Full HD (1080x1920)
    canvas.width = 1080;
    canvas.height = 1920;

    // Рисуем фон (белый или прозрачный)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = () => {
      // Отрисовываем изображение с трансформациями
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.scale(isFlipped ? -scale : scale, scale);
      ctx.drawImage(
        img,
        position.x - img.width / 2,
        position.y - img.height / 2,
        img.width,
        img.height
      );
      ctx.restore();

      // Применяем фильтры
      ctx.filter = `
        brightness(${100 + adjustments.brightness}%)
        contrast(${100 + adjustments.contrast}%)
        saturate(${100 + adjustments.saturation}%)
        hue-rotate(${adjustments.hue}deg)
        blur(${adjustments.blur}px)
      `;

      // Отрисовываем текстовые элементы
      textElements.forEach(text => {
        ctx.save();
        ctx.translate(text.position.x * scale, text.position.y * scale);
        ctx.scale(text.scale, text.scale);
        ctx.rotate(text.rotation * Math.PI / 180);
        
        ctx.font = `
          ${text.isBold ? 'bold ' : ''}
          ${text.isItalic ? 'italic ' : ''}
          24px ${text.fontFamily}
        `;
        ctx.fillStyle = text.color;
        ctx.textAlign = text.alignment;
        
        const lines = text.content.split('\n');
        lines.forEach((line, i) => {
          ctx.fillText(line, 0, i * 30);
        });
        
        if (text.isUnderlined) {
          ctx.strokeStyle = text.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 30);
          ctx.lineTo(ctx.measureText(text.content).width, 30);
          ctx.stroke();
        }
        
        ctx.restore();
      });

      canvas.toBlob(blob => {
        if (!blob) return;
        
        const formData = new FormData();
        formData.append('file', blob, file.name);
        formData.append('metadata', JSON.stringify({
          adjustments,
          rotation,
          isFlipped,
          position,
          scale,
          textElements
        }));
        
        onPublish(formData);
        onClose();
      }, 'image/jpeg', 0.9);
    };
    img.src = preview;
  };

  return (
    <div className="story-modal-overlay">
      <div className="story-modal">
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
            <CgClose size={24} />
          </button>
          {preview && (
            <button className="publish-btn-mobile" onClick={handlePublish}>
              Опубликовать
            </button>
          )}
        </div>

        <div className="editor-container">
          {!preview ? (
            <div 
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <FiDownloadCloud size={48} />
              <p>{isDragging ? 'Отпустите для загрузки' : 'Перетащите фото сюда или нажмите'}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <>
              <div className="preview-wrapper">
                <div 
                  className="preview-container"
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  <img
                    ref={imageRef}
                    className="preview-image"
                    src={preview}
                    alt="story-content"
                    style={{
                      transform: `
                        translate(${position.x}px, ${position.y}px)
                        rotate(${rotation}deg)
                        scaleX(${isFlipped ? -1 : 1})
                        scale(${scale})
                      `,
                      filter: `
                        brightness(${100 + adjustments.brightness}%)
                        contrast(${100 + adjustments.contrast}%)
                        saturate(${100 + adjustments.saturation}%)
                        hue-rotate(${adjustments.hue}deg)
                        blur(${adjustments.blur}px)
                      `,
                      cursor: isDraggingRef.current ? 'grabbing' : 'grab'
                    }}
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                  />

                  {textElements.map(text => (
                    <TextElementComponent
                      key={text.id}
                      text={text}
                      updateText={(content) => handleTextChange(text.id, content)}
                      removeText={() => removeText(text.id)}
                      updateTextStyle={(style) => updateTextStyle(text.id, style)}
                      scale={scale}
                    />
                  ))}
                </div>

                <div className="scale-control">
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={handleScaleChange}
                  />
                  <span className="scale-value">{Math.round(scale * 100)}%</span>
                </div>
              </div>

              <div className="media-controls">
                <button onClick={() => rotateImage(-90)}>
                  <FaArrowRotateLeft />
                </button>
                <button onClick={() => setIsFlipped(!isFlipped)}>
                  <GoMirror />
                </button>
                <button onClick={() => rotateImage(90)}>
                  <FaArrowRotateRight />
                </button>
                <button onClick={resetImagePosition}>
                  <CgClose />
                </button>
                <button 
                  onClick={handleAddText}
                  className={isTextMode ? 'active' : ''}
                >
                  <TbTextSize />
                </button>
              </div>

              <div className="editor-tools">
                <div className="tool-section">
                  <div 
                    className={`section-header ${collapsedSections.corrections ? 'collapsed' : ''}`}
                    onClick={() => toggleSection('corrections')}
                  >
                    <h4>Коррекции</h4>
                    <span className="toggle-icon">▼</span>
                  </div>
                  
                  {!collapsedSections.corrections && (
                    <div className="adjustments">
                      <div className="adjustment-item">
                        <label>Яркость</label>
                        <div className="adjustment-controls">
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={adjustments.brightness}
                            onChange={(e) => setAdjustments(prev => ({
                              ...prev,
                              brightness: Number(e.target.value)
                            }))}
                          />
                          <span className="value-display">{adjustments.brightness}</span>
                        </div>
                      </div>
                      <div className="adjustment-item">
                        <label>Контраст</label>
                        <div className="adjustment-controls">
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={adjustments.contrast}
                            onChange={(e) => setAdjustments(prev => ({
                              ...prev,
                              contrast: Number(e.target.value)
                            }))}
                          />
                          <span className="value-display">{adjustments.contrast}</span>
                        </div>
                      </div>
                      <div className="adjustment-item">
                        <label>Насыщенность</label>
                        <div className="adjustment-controls">
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={adjustments.saturation}
                            onChange={(e) => setAdjustments(prev => ({
                              ...prev,
                              saturation: Number(e.target.value)
                            }))}
                          />
                          <span className="value-display">{adjustments.saturation}</span>
                        </div>
                      </div>
                      <div className="adjustment-item">
                        <label>Оттенок</label>
                        <div className="adjustment-controls">
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={adjustments.hue}
                            onChange={(e) => setAdjustments(prev => ({
                              ...prev,
                              hue: Number(e.target.value)
                            }))}
                          />
                          <span className="value-display">{adjustments.hue}</span>
                        </div>
                      </div>
                      <div className="adjustment-item">
                        <label>Тени</label>
                        <div className="adjustment-controls">
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={adjustments.shadows}
                            onChange={(e) => setAdjustments(prev => ({
                              ...prev,
                              shadows: Number(e.target.value)
                            }))}
                          />
                          <span className="value-display">{adjustments.shadows}</span>
                        </div>
                      </div>
                      <div className="adjustment-item">
                        <label>Размытие</label>
                        <div className="adjustment-controls">
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={adjustments.blur}
                            onChange={(e) => setAdjustments(prev => ({
                              ...prev,
                              blur: Number(e.target.value)
                            }))}
                          />
                          <span className="value-display">{adjustments.blur}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {activeTextId && (
                  <div className="tool-section">
                    <div 
                      className={`section-header ${collapsedSections.text ? 'collapsed' : ''}`}
                      onClick={() => toggleSection('text')}
                    >
                      <h4>Текст</h4>
                      <span className="toggle-icon">▼</span>
                    </div>
                    
                    {!collapsedSections.text && (
                      <div className="text-tools">
                        <select 
                          className="font-selector"
                          onChange={(e) => updateTextStyle(activeTextId, { fontFamily: e.target.value })}
                          value={textElements.find(t => t.id === activeTextId)?.fontFamily || 'Arial'}
                        >
                          {FONT_OPTIONS.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                        
                        <div className="text-style-buttons">
                          <button
                            className={textElements.find(t => t.id === activeTextId)?.isBold ? 'active' : ''}
                            onClick={() => updateTextStyle(activeTextId, { isBold: !textElements.find(t => t.id === activeTextId)?.isBold })}
                          >
                            <FiBold />
                          </button>
                          <button
                            className={textElements.find(t => t.id === activeTextId)?.isItalic ? 'active' : ''}
                            onClick={() => updateTextStyle(activeTextId, { isItalic: !textElements.find(t => t.id === activeTextId)?.isItalic })}
                          >
                            <FiItalic />
                          </button>
                          <button
                            className={textElements.find(t => t.id === activeTextId)?.isUnderlined ? 'active' : ''}
                            onClick={() => updateTextStyle(activeTextId, { isUnderlined: !textElements.find(t => t.id === activeTextId)?.isUnderlined })}
                          >
                            <FiUnderline />
                          </button>
                        </div>
                        
                        <div className="color-picker">
                          {COLOR_OPTIONS.map(color => (
                            <div
                              key={color}
                              className={`color-option ${textElements.find(t => t.id === activeTextId)?.color === color ? 'selected' : ''}`}
                              style={{ background: color }}
                              onClick={() => updateTextStyle(activeTextId, { color })}
                            />
                          ))}
                        </div>
                        
                        <div className="alignment-buttons">
                          <button
                            className={textElements.find(t => t.id === activeTextId)?.alignment === 'left' ? 'active' : ''}
                            onClick={() => updateTextStyle(activeTextId, { alignment: 'left' })}
                          >
                            <CgFormatLeft  />
                          </button>
                          <button
                            className={textElements.find(t => t.id === activeTextId)?.alignment === 'center' ? 'active' : ''}
                            onClick={() => updateTextStyle(activeTextId, { alignment: 'center' })}
                          >
                            <CgFormatCenter />
                          </button>
                          <button
                            className={textElements.find(t => t.id === activeTextId)?.alignment === 'right' ? 'active' : ''}
                            onClick={() => updateTextStyle(activeTextId, { alignment: 'right' })}
                          >
                            <CgFormatRight  />
                          </button>
                        </div>
                        
                        <div className="adjustment-item">
                          <label>Масштаб текста</label>
                          <div className="adjustment-controls">
                            <input
                              type="range"
                              min="0.5"
                              max="2"
                              step="0.1"
                              value={textElements.find(t => t.id === activeTextId)?.scale || 1}
                              onChange={(e) => updateTextStyle(activeTextId, { scale: Number(e.target.value) })}
                            />
                            <span className="value-display">
                              {Math.round((textElements.find(t => t.id === activeTextId)?.scale || 1) * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="adjustment-item">
                          <label>Поворот текста</label>
                          <div className="adjustment-controls">
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={textElements.find(t => t.id === activeTextId)?.rotation || 0}
                              onChange={(e) => updateTextStyle(activeTextId, { rotation: Number(e.target.value) })}
                            />
                            <span className="value-display">
                              {textElements.find(t => t.id === activeTextId)?.rotation || 0}°
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="tool-section">
                  <h4>Действия</h4>
                  <div className="additional-tools">
                    <button className="publish-btn" onClick={handlePublish}>
                      Опубликовать
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}