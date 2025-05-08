// FileUploadPreview.tsx
import { useState, useCallback, useEffect } from 'react';
import { FiX, FiPaperclip } from 'react-icons/fi';
import FileMessage from './FileMessage';
import './Messenger.scss';

type FileUploadPreviewProps = {
    files: Array<{
      id: string;
      name: string;
      size: number;
      type: string;
      progress: number;
      url?: string;
    }>;
    onRemove: (fileId: string) => void;
    onUploadComplete: (fileId: string, url: string) => void;
    onClearAll: () => void;
  };

const FileUploadPreview = ({ 
  files, 
  onRemove, 
  onUploadComplete,
  onClearAll
}: FileUploadPreviewProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const simulateUpload = useCallback((fileId: string) => {
    // Эмуляция загрузки файла
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Генерация URL для демонстрации
        const url = URL.createObjectURL(new Blob([`File ${fileId} content`]));
        onUploadComplete(fileId, url);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [onUploadComplete]);

  useEffect(() => {
    // Запускаем "загрузку" для каждого файла
    const cleanups = files.map(file => {
      if (file.progress < 100) {
        return simulateUpload(file.id);
      }
      return () => {};
    });

    return () => cleanups.forEach(cleanup => cleanup());
  }, [files, simulateUpload]);

  const allFilesUploaded = files.every(file => file.progress === 100);

  if (files.length === 0) return null;

  return (
    <div className={`file-upload-preview ${isDragging ? 'dragging' : ''}`}>
      <div className="file-upload-header">
        <div className="file-upload-title">
          <FiPaperclip /> Прикрепленные файлы ({files.length}/10)
        </div>
        <button 
          className="clear-all-btn"
          onClick={onClearAll}
        >
          <FiX /> Очистить
        </button>
      </div>
      <div className="file-grid">
        {files.map(file => (
          <div key={file.id} className="file-grid-item">
            <FileMessage 
              file={file} 
              onRemove={onRemove}
              isUploading={file.progress < 100}
            />
          </div>
        ))}
      </div>
      {!allFilesUploaded && (
        <div className="upload-progress-info">
          Загрузка файлов... {files.filter(f => f.progress === 100).length}/{files.length}
        </div>
      )}
    </div>
  );
};

export default FileUploadPreview;