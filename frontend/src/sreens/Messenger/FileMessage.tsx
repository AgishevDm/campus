// FileMessage.tsx
import { FiFile, FiDownload, FiX } from 'react-icons/fi';
import './Messenger.scss';

type FileMessageProps = {
    file: {
      id: string;
      name: string;
      size: number;
      type: string;
      url?: string;
      progress?: number;
    };
    onDownload?: (fileId: string) => void;
    onRemove?: (fileId: string) => void;
    isUploading?: boolean;
  };

const FileMessage = ({ file, onDownload, onRemove, isUploading }: FileMessageProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    const typeParts = type.split('/');
    const mainType = typeParts[0];
    
    switch(mainType) {
      case 'image':
        return <img src={file.url} alt={file.name} className="file-thumbnail" />;
      case 'application':
        if (type.includes('pdf')) return <FiFile className="file-icon pdf" />;
        if (type.includes('zip') || type.includes('rar')) return <FiFile className="file-icon archive" />;
        return <FiFile className="file-icon document" />;
      default:
        return <FiFile className="file-icon" />;
    }
  };

  return (
    <div className="file-message">
      <div className="file-preview">
        {getFileIcon(file.type)}
      </div>
      <div className="file-info">
        <div className="file-name">{file.name}</div>
        <div className="file-size">{formatFileSize(file.size)}</div>
        {isUploading && file.progress !== undefined && (
          <div className="file-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${file.progress}%` }}
            ></div>
          </div>
        )}
      </div>
      <div className="file-actions">
        {onDownload && (
          <button 
            className="file-action-btn" 
            onClick={() => onDownload(file.id)}
            title="Скачать"
          >
            <FiDownload />
          </button>
        )}
        {onRemove && (
          <button 
            className="file-action-btn" 
            onClick={() => onRemove(file.id)}
            title="Удалить"
          >
            <FiX />
          </button>
        )}
      </div>
    </div>
  );
};

export default FileMessage;