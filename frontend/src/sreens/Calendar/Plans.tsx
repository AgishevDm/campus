import { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiChevronUp, 
  FiChevronDown, 
  FiX,
  FiCheck,
  FiMoreVertical,
  FiEdit,
  FiEye,
  FiList,
  FiGrid,
  FiArchive,
  FiTarget
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import TaskView from './TaskView';
import { BoardView } from './BoardView';
import './Plans.scss';

type Task = {
  id: string;
  number: number;
  title: string;
  status: 'todo' | 'inProgress' | 'done' | 'completed';
  deadline?: Date;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  color: string;
  progress?: number;
  description?: string;
  completedAt?: string;
};

type Filter = {
  type: 'status' | 'priority' | 'tag';
  value: string;
};

const statusOptions = {
  todo: 'Сделать',
  inProgress: 'В процессе',
  done: 'Сделана',
  completed: 'Завершена'
};

const priorityOptions = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
};

const tagOptions = ['работа', 'учеба', 'хобби', 'тренировка', 'репетиция'];

const calculateProgress = (deadline?: Date): { progress: number, color: string } => {
  if (!deadline) return { progress: 0, color: '#db233d' };
  
  const now = new Date().getTime();
  const deadlineTime = deadline.getTime();
  const diff = deadlineTime - now;
  
  if (diff < 0) return { progress: 100, color: '#db233d' };
  
  const total = 30 * 24 * 60 * 60 * 1000;
  const progress = Math.min(100 - (diff / total) * 100, 100);
  
  const hue = ((100 - progress) * 120 / 100);
  const color = `hsl(${hue}, 100%, 45%)`;
  
  return { progress, color };
};

const getPriorityOrder = (priority: 'low' | 'medium' | 'high') => {
  switch(priority) {
    case 'low': return 1;
    case 'medium': return 2;
    case 'high': return 3;
    default: return 0;
  }
};

export default function Plans() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'boards' | 'goals'>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'number' | 'title' | 'deadline' | 'priority'>('number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filterMenuState, setFilterMenuState] = useState<{
    main: boolean;
    status?: boolean;
    priority?: boolean;
    tag?: boolean;
  }>({
    main: false,
    status: false,
    priority: false,
    tag: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const tasksPerPage = 10;
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      number: 1,
      title: 'Завершить проект по календарю',
      status: 'inProgress',
      deadline: new Date('2025-03-25'),
      tags: ['работа', 'учеба'],
      priority: 'high',
      color: '#FF3B30'
    },
    {
      id: '2',
      number: 2,
      title: 'Подготовить презентацию',
      status: 'todo',
      deadline: new Date('2025-05-21'),
      tags: ['работа'],
      priority: 'medium',
      color: '#FFD700'
    },
    {
      id: '3',
      number: 3,
      title: 'Подготовить презентацию',
      status: 'completed',
      deadline: new Date('2025-06-21'),
      tags: ['работа'],
      priority: 'medium',
      color: '#FFD700'
    },
    {
      id: '4',
      number: 4,
      title: 'Подготовить презентацию',
      status: 'done',
      deadline: new Date('2025-06-06'),
      tags: ['работа'],
      priority: 'medium',
      color: '#FFD700'
    }
  ]);

  const processedTasks = tasks
  .filter(task => {
    // Фильтрация по поисковому запросу
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Фильтрация по активным фильтрам
    const matchesFilters = filters.every(filter => {
      switch(filter.type) {
        case 'status': 
          return task.status === filter.value;
        case 'priority': 
          return task.priority === filter.value;
        case 'tag': 
          return task.tags.includes(filter.value);
        default: 
          return true;
      }
    });
    
    return matchesSearch && matchesFilters;
  })
  .sort((a, b) => {
    // Если выбрана сортировка по конкретному полю
    if (sortOrder !== 'none') {
      switch(sortField) {
        case 'number':
          return sortOrder === 'asc' 
            ? a.number - b.number 
            : b.number - a.number;
        
        case 'title':
          return sortOrder === 'asc' 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
        
        case 'priority':
          const aPriority = getPriorityOrder(a.priority);
          const bPriority = getPriorityOrder(b.priority);
          return sortOrder === 'asc' 
            ? aPriority - bPriority 
            : bPriority - aPriority;
        
        case 'deadline':
          const aDate = a.deadline?.getTime() || 0;
          const bDate = b.deadline?.getTime() || 0;
          return sortOrder === 'asc' 
            ? aDate - bDate 
            : bDate - aDate;
        
        default:
          return 0;
      }
    }
    
    // По умолчанию - сортировка по номеру в обратном порядке (новые сверху)
    return b.number - a.number;
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = processedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(processedTasks.length / tasksPerPage);

  const addFilter = (type: Filter['type'], value: string) => {
    if(!filters.some(f => f.type === type && f.value === value)) {
      setFilters([...filters, { type, value }]);
    }
    setFilterMenuState({ main: false, status: false, priority: false, tag: false });
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

   const nextTaskNumber = tasks.length > 0 
    ? Math.max(...tasks.map(t => t.number)) + 1 
    : 1;

   const handleTaskUpdate = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const toggleSort = (field: 'number' | 'title' | 'deadline' | 'priority') => {
    if (sortField === field) {
      if (sortOrder === 'none') {
        setSortOrder('asc');
      } else if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('none');
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleMenuToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === id ? null : id);
  };

   const handleCreateTask = () => {
    setIsCreatingTask(true);
  };

  const handleSaveNewTask = (newTask: Task) => {
    setTasks([{
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
      number: nextTaskNumber
    }, ...tasks]);
    setIsCreatingTask(false);
  };

  const closeMenus = () => {
    setFilterMenuState({ main: false, status: false, priority: false, tag: false });
    setMenuOpenId(null);
  };

  useEffect(() => {
    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

  const getFilterLabel = (filter: Filter) => {
    switch(filter.type) {
      case 'status':
        return statusOptions[filter.value as keyof typeof statusOptions];
      case 'priority':
        return priorityOptions[filter.value as keyof typeof priorityOptions];
      case 'tag':
        return `#${filter.value}`;
      default:
        return filter.value;
    }
  };

  return (
    <div className="plans-container">
      {selectedTask ? (
        <TaskView 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)}
          onSave={(updatedTask) => {
            setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            setSelectedTask(null);
          }}
        />
      ) : isCreatingTask ? (
        <TaskView 
          isCreating={true}
          nextTaskNumber={nextTaskNumber}
          onClose={() => setIsCreatingTask(false)}
          onSave={handleSaveNewTask}
        />
      ) : (
        <>
      <div className="header-container">
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <FiList className="tab-icon" />
            <span className="desktop-text">Задачи</span>
          </button>
          <button
            className={`tab ${activeTab === 'boards' ? 'active' : ''}`}
            onClick={() => setActiveTab('boards')}
          >
            <FiGrid className="tab-icon" />
            <span className="desktop-text">Доски</span>
          </button>
          <button
            className={`tab ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            <FiTarget className="tab-icon" />
            <span className="desktop-text">Цели</span>
          </button>
        </div>
        
        <div className="actions-container">
              <button className="create-btn" onClick={handleCreateTask}>
                <FiPlus className="create-icon" />
                <span className="desktop-text">Создать</span>
              </button>
        </div>
      </div>

      {activeTab === 'tasks' && (
        <div className="tasks-container">
          <div className="controls-pln">
            <div className="search-and-filters">
              <div className="search">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Поиск задач..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-section">
                <div 
                  className="filter-menu"
                  onMouseLeave={() => setFilterMenuState(prev => ({ ...prev, main: false }))}
                >
                  <button 
                    className="filter-btn"
                    onMouseEnter={() => setFilterMenuState({ main: true })}
                  >
                    <FiFilter />
                  </button>

                  <AnimatePresence>
                    {filterMenuState.main && (
                      <motion.div
                        className="menu main-menu"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <div 
                          className="menu-item"
                          onMouseEnter={() => setFilterMenuState({ main: true, status: true })}
                        >
                          Статус
                        </div>
                        <div 
                          className="menu-item"
                          onMouseEnter={() => setFilterMenuState({ main: true, priority: true })}
                        >
                          Приоритет
                        </div>
                        <div 
                          className="menu-item"
                          onMouseEnter={() => setFilterMenuState({ main: true, tag: true })}
                        >
                          Теги
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {filterMenuState.status && (
                      <motion.div
                        className="menu sub-menu"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onMouseLeave={() => setFilterMenuState(prev => ({ ...prev, status: false }))}
                      >
                        {Object.entries(statusOptions).map(([key, label]) => (
                          <div 
                            key={key}
                            className="menu-item"
                            onClick={() => addFilter('status', key)}
                          >
                            {label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {filterMenuState.priority && (
                      <motion.div
                        className="menu sub-menu"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onMouseLeave={() => setFilterMenuState(prev => ({ ...prev, priority: false }))}
                      >
                        {Object.entries(priorityOptions).map(([key, label]) => (
                          <div 
                            key={key}
                            className="menu-item"
                            onClick={() => addFilter('priority', key)}
                          >
                            {label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {filterMenuState.tag && (
                      <motion.div
                        className="menu sub-menu"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onMouseLeave={() => setFilterMenuState(prev => ({ ...prev, tag: false }))}
                      >
                        {tagOptions.map((tag) => (
                          <div 
                            key={tag}
                            className="menu-item"
                            onClick={() => addFilter('tag', tag)}
                          >
                            #{tag}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            {filters.length > 0 && (
              <div className="active-filters-container">
                {filters.map((filter, index) => (
                  <motion.div 
                    key={index}
                    className="filter-tag"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span>{getFilterLabel(filter)}</span>
                    <FiX onClick={() => removeFilter(index)} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="tasks-list">
            <div className="tasks-header">
              <div 
                className="header-item sortable" 
                onClick={() => toggleSort('number')}
              >
                №
                {sortField === 'number' && sortOrder !== 'none' && (
                  <span className="sort-icon">
                    {sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                )}
              </div>
              <div 
                className="header-item sortable" 
                onClick={() => toggleSort('title')}
              >
                Название
                {sortField === 'title' && sortOrder !== 'none' && (
                  <span className="sort-icon">
                    {sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                )}
              </div>
              <div className="header-item">Статус</div>
              <div 
                className="header-item sortable" 
                onClick={() => toggleSort('deadline')}
              >
                Дедлайн
                {sortField === 'deadline' && sortOrder !== 'none' && (
                  <span className="sort-icon">
                    {sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                )}
              </div>
              <div className="header-item desktop-only">Теги</div>
              <div 
                className="header-item desktop-only sortable"
                onClick={() => toggleSort('priority')}
              >
                Приоритет
                {sortField === 'priority' && sortOrder !== 'none' && (
                  <span className="sort-icon">
                    {sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                )}
              </div>
              <div className="header-item"></div>
            </div>

            {currentTasks.map(task => {
              const { progress, color } = calculateProgress(task.deadline);
              const isOverdue = progress >= 100;
              
              return (
                <motion.div 
                  key={task.id}
                  className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="task-color" style={{ backgroundColor: task.color }} />
                  <div className="task-number">{task.number}</div>
                  <div className="task-title" title={task.title}>
                    {task.title}
                  </div>
                  <div className={`task-status ${task.status}`}>
                    {statusOptions[task.status]}
                  </div>
                  <div className="task-deadline">
                    <div className={`deadline-date ${isOverdue ? 'overdue' : ''}`}>
                      {task.deadline?.toLocaleDateString('ru-RU') || 'не указан'}
                    </div>
                    <div className="progress-container">
                      {isOverdue ? (
                        <span className="overdue-badge">Просрочено</span>
                      ) : task.status !== 'completed' && (
                        <motion.div 
                          className="progress-bar"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%`, backgroundColor: color }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="task-tags desktop-only">
                    {task.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className={`task-priority desktop-only ${task.priority}`}>
                    {priorityOptions[task.priority]}
                  </div>
                  <div 
                    className="task-menu" 
                    onClick={(e) => handleMenuToggle(task.id, e)}
                  >
                    <FiMoreVertical />
                    <AnimatePresence>
                      {menuOpenId === task.id && (
                        <motion.div
                          className="context-menu"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <button><FiEye /> Просмотр</button>
                          <button><FiEdit /> Изменить</button>
                          <button className="danger"><FiX /> Закрыть</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            )}
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i+1}
                className={currentPage === i+1 ? 'active' : ''}
                onClick={() => setCurrentPage(i+1)}
              >
                {i+1}
              </button>
            ))}
          </div>
        </div>
       )} 
       {activeTab === 'boards' && (
            <BoardView tasks={tasks} onTaskUpdate={handleTaskUpdate} />
        )}
       
       </>
      )}
    </div>
  );
}
