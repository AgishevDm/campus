import { useState, useEffect } from 'react';
import { 
  FiEdit, 
  FiX, 
  FiChevronLeft,
  FiCheck,
  FiCalendar,
  FiTag,
  FiFlag,
  FiCircle
} from 'react-icons/fi';
import './TaskView.scss';

export type Task = {
  id: string;
  number: number;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done' | 'completed';
  deadline?: Date;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  color: string;
  completedAt?: string;
};

type StatusOption = {
  value: 'todo' | 'inProgress' | 'done' | 'completed';
  label: string;
  color: string;
};

type PriorityOption = {
  value: 'low' | 'medium' | 'high';
  label: string;
  color: string;
};

const statusOptions: StatusOption[] = [
  { value: 'todo', label: 'Сделать', color: '#fff3cd' },
  { value: 'inProgress', label: 'В процессе', color: '#cfe2ff' },
  { value: 'done', label: 'Сделана', color: '#d1e7dd' },
  { value: 'completed', label: 'Завершена', color: '#e2e3e5' }
];

const priorityOptions: PriorityOption[] = [
  { value: 'low', label: 'Низкий', color: '#d1e7dd' },
  { value: 'medium', label: 'Средний', color: '#fff3cd' },
  { value: 'high', label: 'Высокий', color: '#f8d7da' }
];

const colors = [
  '#FF3B30', '#FFD700', '#34C759', 
  '#00CED1', '#007AFF', '#9B59B6',
  '#FF94C2', '#808000', '#808080', '#030303'
];

const defaultTags = ['работа', 'учеба', 'личное', 'срочно', 'хобби'];

interface TaskViewProps {
  task?: Task;
  isCreating?: boolean;
  nextTaskNumber?: number;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export default function TaskView({ task, isCreating = false, nextTaskNumber = 1, onClose, onSave }: TaskViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  const [editedTask, setEditedTask] = useState<Task>(task || {
    id: Math.random().toString(36).substr(2, 9),
    number: nextTaskNumber,
    title: '',
    description: '',
    status: 'todo',
    deadline: undefined,
    tags: [],
    priority: 'medium',
    color: '#FF3B30',
  });
  const [newTag, setNewTag] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (task) {
      setEditedTask(task);
      setIsEditing(false);
    } else {
      setEditedTask({
        id: Math.random().toString(36).substr(2, 9),
        number: nextTaskNumber,
        title: '',
        description: '',
        status: 'todo',
        deadline: undefined,
        tags: [],
        priority: 'medium',
        color: '#FF3B30',
      });
      setIsEditing(true);
    }
  }, [task, nextTaskNumber]);

  const handleStatusChange = (status: 'todo' | 'inProgress' | 'done' | 'completed') => {
    setEditedTask(prev => ({ ...prev, status }));
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    setEditedTask(prev => ({ ...prev, priority }));
  };

  const handleColorChange = (color: string) => {
    setEditedTask(prev => ({ ...prev, color }));
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    setEditedTask(prev => ({ ...prev, deadline: date }));
  };

  const handleAddTag = (tag?: string) => {
    const tagToAdd = tag || newTag.trim();
    setValidationError('');

    if (!tagToAdd) return;
    
    if (editedTask.tags.length >= 3) {
      setValidationError('Максимум 3 тега');
      return;
    }
    
    if (editedTask.tags.includes(tagToAdd)) {
      setValidationError('Тег уже существует');
      return;
    }

    setEditedTask(prev => ({
      ...prev,
      tags: [...prev.tags, tagToAdd]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTask(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    setValidationError('');
    
    if (!editedTask.title.trim()) {
      setValidationError('Название задачи обязательно');
      return;
    }
    
    onSave(editedTask);
    setIsEditing(false);
    if (isCreating) onClose();
  };

  return (
    <div className="task-view-container">
      <div className="task-view-header">
        <button className="back-button-task" onClick={onClose}>
          {isCreating ? <FiX /> : <FiChevronLeft />}
        </button>
        <div className="header-left">
          <div className="task-info">
            {isEditing ? (
              <div className="task-title-input-container">
                <span className="task-number">#{editedTask.number}</span>
                <div className="title-input-wrapper">
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                    className="task-title-input"
                    placeholder="Название задачи"
                  />
                  {validationError && (
                    <div className="title-error">{validationError}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="task-title-container">
                <span className="task-number">#{editedTask.number}</span>
                <div className="task-title">{editedTask.title}</div>
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <button className="save-button" onClick={handleSave}>
            <FiCheck />
            <span>Сохранить</span>
          </button>
        ) : (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <FiEdit />
            <span>Редактировать</span>
          </button>
        )}
      </div>
      
      <div className="task-view-content">
        <div className="task-main-content">
          <div className="task-description">
            <h3>Описание</h3>
            {isEditing ? (
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Добавьте описание задачи..."
              />
            ) : (
              <p>{editedTask.description || 'Описание отсутствует'}</p>
            )}
          </div>
        </div>
        
        <div className="task-sidebar">
          <div className="sidebar-section">
            <h3><FiFlag /> Статус</h3>
            {isEditing ? (
              <div className="status-options">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    className={`status-option ${editedTask.status === option.value ? 'active' : ''}`}
                    style={{ backgroundColor: option.color }}
                    onClick={() => handleStatusChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="current-status" style={{ backgroundColor: statusOptions.find(s => s.value === editedTask.status)?.color }}>
                {statusOptions.find(s => s.value === editedTask.status)?.label}
              </div>
            )}
          </div>
          
          <div className="sidebar-section">
            <h3><FiFlag /> Приоритет</h3>
            {isEditing ? (
              <div className="priority-options">
                {priorityOptions.map(option => (
                  <button
                    key={option.value}
                    className={`priority-option ${editedTask.priority === option.value ? 'active' : ''}`}
                    style={{ backgroundColor: option.color }}
                    onClick={() => handlePriorityChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="current-priority" style={{ backgroundColor: priorityOptions.find(p => p.value === editedTask.priority)?.color }}>
                {priorityOptions.find(p => p.value === editedTask.priority)?.label}
              </div>
            )}
          </div>
          
          <div className="sidebar-section">
            <h3><FiCalendar /> Дедлайн</h3>
            {isEditing ? (
              <input
                type="date"
                value={editedTask.deadline?.toISOString().split('T')[0] || ''}
                onChange={handleDeadlineChange}
              />
            ) : (
              <div className="current-deadline">
                {editedTask.deadline?.toLocaleDateString('ru-RU') || 'Не установлен'}
              </div>
            )}
          </div>
          
          <div className="sidebar-section">
            <h3><FiTag /> Теги</h3>
            <div className="tags-container">
              {editedTask.tags.map(tag => (
                <div key={tag} className="tag">
                  #{tag}
                  {isEditing && (
                    <button onClick={() => handleRemoveTag(tag)}>
                      <FiX size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <>
                <div className="add-tag">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Добавить тег"
                    maxLength={20}
                  />
                  <button 
                    onClick={() => handleAddTag()}
                    disabled={editedTask.tags.length >= 3}
                  >
                    +
                  </button>
                </div>
                <div className="default-tags">
                  {defaultTags.map(tag => (
                    <button
                      key={tag}
                      className="default-tag"
                      onClick={() => handleAddTag(tag)}
                      disabled={editedTask.tags.includes(tag) || editedTask.tags.length >= 3}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="sidebar-section">
            <h3><FiCircle /> Цвет</h3>
            {isEditing ? (
              <div className="color-options">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`color-option ${editedTask.color === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            ) : (
              <div className="current-color" style={{ backgroundColor: editedTask.color }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}