import { FiX, FiImage, FiTrash2 } from 'react-icons/fi';
import { Props } from './types';
import { useState } from 'react';

export default function CreatePostModal({
  currentPost,
  setCurrentPost,
  isOpen,
  onClose,
  onSubmit,
  onImageUpload,
  userRole,
  previewImages,
  setPreviewImages,
  removeImage,
  setImageFiles
}: Props & { setImageFiles: React.Dispatch<React.SetStateAction<File[]>> }) { 
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length + previewImages.length > 10) {
      alert('Можно загрузить только 10 фотографий');
      files.splice(10 - previewImages.length);
    }
  
    setImageFiles(prev => [...prev, ...files]);
  
    const newPreviews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push(event.target?.result as string);
        if (newPreviews.length === files.length) {
          setPreviewImages(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="create-modal">
        <div className="modal-header">
          <h2>Новый пост</h2>
          <FiX onClick={onClose} />
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Тип поста</label>
            <select
              value={currentPost.type}
              onChange={(e) => setCurrentPost({
                ...currentPost,
                type: e.target.value as 'news' | 'event' | 'ad'
              })}
            >
              <option value="news">Новость</option>
              <option value="event">Событие</option>
              {userRole === 'admin' && (
                <option value="ad">Реклама</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Заголовок</label>
            <input
              value={currentPost.title || ''}
              onChange={(e) => setCurrentPost({
                ...currentPost,
                title: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label>Локация (адрес)</label>
            <input
              value={currentPost.location || ''}
              onChange={(e) => setCurrentPost({
                ...currentPost,
                location: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label>Ссылка для локации (необязательно)</label>
            <input
              type="url"
              value={currentPost.locationLink || ''}
              onChange={(e) => setCurrentPost({
                ...currentPost,
                locationLink: e.target.value
              })}
              placeholder="Вставьте ссылку"
            />
          </div>

          {currentPost.type === 'event' && (
            <div className="form-row">
              <div className="form-group">
                <label>Дата события</label>
                <input
                  type="date"
                  value={currentPost.eventDate || ''}
                  onChange={(e) => setCurrentPost({
                    ...currentPost,
                    eventDate: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Время события</label>
                <input
                  type="time"
                  value={currentPost.eventTime || ''}
                  onChange={(e) => setCurrentPost({
                    ...currentPost,
                    eventTime: e.target.value
                  })}
                  required
                />
              </div>
            </div>
          )}

          {currentPost.type === 'ad' && (
            <div className="form-group">
              <label>Ссылка</label>
              <input
                type="url"
                value={currentPost.link || ''}
                onChange={(e) => setCurrentPost({
                  ...currentPost,
                  link: e.target.value
                })}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Текст поста</label>
            <textarea
              value={currentPost.text || ''}
              onChange={(e) => setCurrentPost({
                ...currentPost,
                text: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label>Изображения (макс. 10)</label>
            <div 
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="upload-content">
                <FiImage className="upload-icon" />
                <p>{previewImages.length > 0 ? 'Добавьте или перетащите ещё фото' : 'Перетащите сюда фото или нажмите для загрузки'}</p>
                <span>Доступно {10 - previewImages.length} файлов</span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={onImageUpload}
                hidden
              />
            </div>

            <div className="image-previews">
              {previewImages.map((img, index) => (
                <div key={index} className="image-preview-item">
                  <img src={img} alt={`preview-${index}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className="submit-btn">
              Опубликовать
            </button>
           </div>
        </form>
      </div>
    </div>
  );
};