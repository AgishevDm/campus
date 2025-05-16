import { useEffect, useRef } from 'react';
import { FiCalendar, FiPaperclip, FiMapPin } from 'react-icons/fi';
import './Messenger.scss';

type Props = {
  showMenu: boolean;
  menuPosition: { top: number; left: number };
  onCloseMenu: () => void;
  onAttachFile: () => void;
  onAttachEvent: () => void;
  onAttachLocation: () => void;
};

const MessageInput = ({
  showMenu,
  menuPosition,
  onCloseMenu,
  onAttachFile,
  onAttachEvent,
  onAttachLocation,
}: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onCloseMenu();
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, onCloseMenu]);

  if (!showMenu) return null;

  return (
    <div 
      ref={menuRef}
      className="attach-menu"
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
    >
      <button 
        onClick={() => {
          onAttachEvent();
          onCloseMenu();
        }}
        className="attach-menu-item"
      >
        <FiCalendar className="menu-icon" />
        Создать событие
      </button>
      
      <button 
        onClick={() => {
          onAttachFile();
          onCloseMenu();
        }}
        className="attach-menu-item"
      >
        <FiPaperclip className="menu-icon" />
        Загрузить файлы
      </button>
      
      <button 
        onClick={() => {
          onAttachLocation();
          onCloseMenu();
        }}
        className="attach-menu-item"
      >
        <FiMapPin className="menu-icon" />
        Геопозиция
      </button>
    </div>
  );
};

export default MessageInput;