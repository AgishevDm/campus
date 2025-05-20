import { useState, useEffect, useMemo } from 'react';
import { 
  FiPlus, FiCheck, FiX, FiEdit, FiEye, FiTrash2, FiMoreVertical,
  FiTrendingUp, FiCalendar, FiBarChart2, FiTarget, FiChevronDown, 
  FiChevronUp, FiChevronRight, FiChevronLeft, FiSearch, FiFilter,
  FiClock, FiTag, FiFlag
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Goals.scss';

Chart.register(...registerables);

type GoalStatus = 'active' | 'paused' | 'completed' | 'archived';
type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
type GoalType = 'personal' | 'work' | 'health' | 'education' | 'financial';

interface Goal {
  id: string;
  number: number;
  title: string;
  description: string;
  status: GoalStatus;
  priority: GoalPriority;
  type: GoalType;
  targetDate?: Date;
  createdAt: Date;
  completedTasks: number;
  totalTasks: number;
  progress: number;
  color: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'inProgress' | 'done' | 'completed';
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const goalStatuses = {
  active: 'Активна',
  paused: 'На паузе',
  completed: 'Завершена',
  archived: 'В архиве'
};

const goalPriorities = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критичный'
};

const goalTypes = {
  personal: 'Личная',
  work: 'Работа',
  health: 'Здоровье',
  education: 'Образование',
  financial: 'Финансы'
};

const taskStatuses = {
  todo: 'К выполнению',
  inProgress: 'В процессе',
  done: 'Выполнена',
  completed: 'Завершена'
};

const colors = [
  '#FF3B30', '#FFD700', '#34C759', 
  '#00CED1', '#007AFF', '#9B59B6',
  '#FF94C2', '#808000', '#808080'
];

const generateMockGoals = (): Goal[] => {
  return [
    {
      id: '1',
      number: 1,
      title: 'Завершить курс по React',
      description: 'Пройти все уроки и выполнить финальный проект',
      status: 'active',
      priority: 'high',
      type: 'education',
      targetDate: new Date('2025-07-01'),
      createdAt: new Date('2025-01-15'),
      completedTasks: 5,
      totalTasks: 10,
      progress: 50,
      color: '#007AFF',
      tasks: [
        {
          id: 't1',
          title: 'Изучить хуки',
          status: 'completed',
          deadline: new Date('2025-02-15'),
          priority: 'high',
          completed: true
        },
        {
          id: 't2',
          title: 'Разобраться с Context API',
          status: 'inProgress',
          deadline: new Date('2025-03-01'),
          priority: 'medium',
          completed: false
        },
        {
          id: 't3',
          title: 'Практика с Redux',
          status: 'todo',
          deadline: new Date('2025-04-15'),
          priority: 'high',
          completed: false
        }
      ]
    },
    {
      id: '2',
      number: 2,
      title: 'Создать финансовую подушку',
      description: 'Накопить 6 месячных зарплат',
      status: 'active',
      priority: 'critical',
      type: 'financial',
      targetDate: new Date('2025-12-31'),
      createdAt: new Date('2025-01-10'),
      completedTasks: 2,
      totalTasks: 6,
      progress: 33,
      color: '#34C759',
      tasks: [
        {
          id: 't4',
          title: 'Откладывать 20% от зарплаты',
          status: 'completed',
          deadline: new Date('2025-01-31'),
          priority: 'high',
          completed: true
        },
        {
          id: 't5',
          title: 'Инвестировать в ETF',
          status: 'inProgress',
          deadline: new Date('2025-06-30'),
          priority: 'medium',
          completed: false
        }
      ]
    }
  ];
};

const AnalyticsCard = ({ title, value, icon, trend, chart }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  trend?: number;
  chart?: boolean;
}) => (
  <div className="analytics-card">
    <div className="analytics-icon">{icon}</div>
    <div className="analytics-content">
      <div className="analytics-title">{title}</div>
      <div className="analytics-value">{value}</div>
      {trend !== undefined && (
        <div className={`analytics-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
          {trend >= 0 ? <FiChevronUp /> : <FiChevronDown />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    {chart && (
      <div className="analytics-chart">
        <Bar 
          data={{
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            datasets: [{
              data: [30, 45, 60, 50, 70, 40, 80],
              backgroundColor: '#db233d',
              borderRadius: 4
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { display: false },
              x: { display: false }
            }
          }}
          height={40}
          width={80}
        />
      </div>
    )}
  </div>
);

const ProgressBar = ({ progress, color }: { progress: number; color: string }) => {
  return (
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ 
          width: `${progress}%`,
          backgroundColor: color
        }}
      >
        <div className="progress-label">{progress}%</div>
      </div>
    </div>
  );
};

const TaskItem = ({ task }: { task: Task }) => {
  return (
    <div className="task-item">
      <div className="task-status">
        <div className={`status-dot ${task.status}`} />
      </div>
      <div className="task-title">{task.title}</div>
      <div className="task-priority">
        <span className={`priority-badge ${task.priority}`}>
          {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
        </span>
      </div>
      <div className="task-deadline">
        {task.deadline ? (
          <>
            <FiCalendar size={14} />
            {task.deadline.toLocaleDateString('ru-RU')}
          </>
        ) : 'Нет срока'}
      </div>
    </div>
  );
};

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [sortField, setSortField] = useState<'number' | 'title' | 'progress' | 'priority'>('number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    status?: GoalStatus;
    type?: GoalType;
    priority?: GoalPriority;
  }>({});
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API
    setGoals(generateMockGoals());
  }, []);

  const toggleGoalExpand = (goalId: string) => {
    const newSet = new Set(expandedGoals);
    if (newSet.has(goalId)) {
      newSet.delete(goalId);
    } else {
      newSet.add(goalId);
    }
    setExpandedGoals(newSet);
  };

  const nextGoalNumber = goals.length > 0 
    ? Math.max(...goals.map(g => g.number)) + 1 
    : 1;

  const handleCreateGoal = () => {
    setSelectedGoal({
      id: '',
      number: nextGoalNumber,
      title: '',
      description: '',
      status: 'active',
      priority: 'medium',
      type: 'personal',
      createdAt: new Date(),
      completedTasks: 0,
      totalTasks: 0,
      progress: 0,
      color: colors[0],
      tasks: []
    });
    setIsCreating(true);
  };

  const handleSaveGoal = (goal: Goal) => {
    const progress = goal.tasks.length > 0 
      ? Math.round((goal.tasks.filter(t => t.completed).length / goal.tasks.length) * 100) : 0;

    const updatedGoal = {
      ...goal,
      completedTasks: goal.tasks.filter(t => t.completed).length,
      totalTasks: goal.tasks.length,
      progress
    };

    if (isCreating) {
      setGoals([{
        ...updatedGoal,
        id: Math.random().toString(36).substr(2, 9)
      }, ...goals]);
    } else {
      setGoals(goals.map(g => g.id === goal.id ? updatedGoal : g));
    }
    setIsCreating(false);
    setIsEditing(false);
    setSelectedGoal(null);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleAddTask = (goalId: string) => {
  setGoals(goals.map(goal => {
    if (goal.id === goalId) {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Новая задача',
        status: 'todo',
        deadline: undefined,
        priority: 'medium',
        completed: false
      };
      return {
        ...goal,
        tasks: [...goal.tasks, newTask]
      };
    }
    return goal;
  }));
};

const handleTaskChange = (goalId: string, taskId: string, updates: Partial<Task>) => {
  setGoals(goals.map(goal => {
    if (goal.id === goalId) {
      return {
        ...goal,
        tasks: goal.tasks.map(task => {
          if (task.id === taskId) {
            const updatedTask = { ...task, ...updates };
            // Убедимся, что статус соответствует типу
            if (updates.status) {
              updatedTask.status = updates.status as 'todo' | 'inProgress' | 'done' | 'completed';
            }
            // Обновляем completed в зависимости от статуса
            updatedTask.completed = updatedTask.status === 'completed';
            return updatedTask;
          }
          return task;
        })
      };
    }
    return goal;
  }));
};

  const handleMenuToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const toggleSort = (field: 'number' | 'title' | 'progress' | 'priority') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleFilter = (type: 'status' | 'type' | 'priority', value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[type] === value) {
        delete newFilters[type];
      } else {
        newFilters[type] = value as any;
      }
      return newFilters;
    });
  };

  const filteredGoals = useMemo(() => {
    return goals
      .filter(goal => {
        // Фильтрация по поиску
        if (searchQuery && !goal.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Фильтрация по выбранным фильтрам
        for (const [key, value] of Object.entries(filters)) {
          if (goal[key as keyof typeof filters] !== value) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch(sortField) {
          case 'number':
            comparison = a.number - b.number;
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'progress':
            comparison = a.progress - b.progress;
            break;
          case 'priority':
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [goals, searchQuery, filters, sortField, sortOrder]);

  // Аналитика
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;

  const progressData = {
    labels: goals.map(g => g.title),
    datasets: [{
      data: goals.map(g => g.progress),
      backgroundColor: goals.map(g => g.color),
      borderRadius: 4
    }]
  };

  return (
    <div className="goals-container">
      {/* <div className="goals-header">
        <h2><FiTarget /> Цели</h2>
        <button className="create-goal-btn" onClick={handleCreateGoal}>
          <FiPlus /> Новая цель
        </button>
      </div> */}

      <div className="controls-goal">
        <div className="search">
          <FiSearch />
          <input
            type="text"
            placeholder="Поиск по названию цели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-section">
          <button 
            className={`filter-btn ${Object.keys(filters).length > 0 ? 'active' : ''}`}
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
          >
            <FiFilter /> Фильтры
            {Object.keys(filters).length > 0 && (
              <span className="filter-count">{Object.keys(filters).length}</span>
            )}
          </button>
          
          <AnimatePresence>
            {filterMenuOpen && (
              <motion.div 
                className="filter-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="filter-group">
                  <div className="filter-title">Статус</div>
                  {Object.entries(goalStatuses).map(([key, label]) => (
                    <button
                      key={key}
                      className={`filter-option ${filters.status === key ? 'active' : ''}`}
                      onClick={() => toggleFilter('status', key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                
                <div className="filter-group">
                  <div className="filter-title">Тип</div>
                  {Object.entries(goalTypes).map(([key, label]) => (
                    <button
                      key={key}
                      className={`filter-option ${filters.type === key ? 'active' : ''}`}
                      onClick={() => toggleFilter('type', key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                
                <div className="filter-group">
                  <div className="filter-title">Приоритет</div>
                  {Object.entries(goalPriorities).map(([key, label]) => (
                    <button
                      key={key}
                      className={`filter-option ${filters.priority === key ? 'active' : ''}`}
                      onClick={() => toggleFilter('priority', key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="analytics-section">
        <AnalyticsCard 
          title="Всего целей" 
          value={goals.length.toString()} 
          icon={<FiTarget />} 
        />
        <AnalyticsCard 
          title="Завершено" 
          value={`${completedGoals} из ${goals.length}`} 
          icon={<FiCheck />} 
          trend={10}
        />
        <AnalyticsCard 
          title="Активных" 
          value={activeGoals.toString()} 
          icon={<FiTrendingUp />} 
        />
        <AnalyticsCard 
          title="Прогресс" 
          value={`${averageProgress}%`} 
          icon={<FiBarChart2 />} 
          chart
        />
      </div>

      <div className="goals-list-container">
        <div className="goals-list-header">
          <div className="header-item"></div>
          <div 
            className="header-item sortable" 
            onClick={() => toggleSort('title')}
          >
            Название
            {sortField === 'title' && (
              <span className="sort-icon">
                {sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
              </span>
            )}
          </div>
          <div 
            className="header-item sortable" 
            onClick={() => toggleSort('progress')}
          >
            Прогресс
            {sortField === 'progress' && (
              <span className="sort-icon">
                {sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
              </span>
            )}
          </div>
          <div className="header-item">Задачи</div>
          <div className="header-item">Тип</div>
          <div 
            className="header-item sortable" 
            onClick={() => toggleSort('priority')}
          >
            Приоритет
            {sortField === 'priority' && (
              <span className="sort-icon">
                {sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
              </span>
            )}
          </div>
          <div className="header-item">Статус</div>
          {/* <div className="header-item">Действия</div> */}
        </div>

        <div className="goals-list">
          {filteredGoals.map(goal => (
            <div key={goal.id} className="goal-item">
              <div 
                className="goal-expand" 
                onClick={() => toggleGoalExpand(goal.id)}
              >
                {expandedGoals.has(goal.id) ? <FiChevronDown /> : <FiChevronRight />}
              </div>
              
              <div className="goal-title" onClick={() => toggleGoalExpand(goal.id)}>
                <div className="goal-color" style={{ backgroundColor: goal.color }} />
                {goal.title}
              </div>
              
              <div className="goal-progress">
                <ProgressBar progress={goal.progress} color={goal.color} />
              </div>
              
              <div className="goal-tasks">
                {goal.completedTasks}/{goal.totalTasks}
              </div>
              
              <div className="goal-type">
                <span className={`type-badge ${goal.type}`}>
                  {goalTypes[goal.type]}
                </span>
              </div>
              
              <div className="goal-priority">
                <span className={`priority-badge ${goal.priority}`}>
                  {goalPriorities[goal.priority]}
                </span>
              </div>
              
              <div className="goal-status">
                <span className={`status-badge ${goal.status}`}>
                  {goalStatuses[goal.status]}
                </span>
              </div>
              
              <div 
                className="goal-actions" 
                onClick={(e) => handleMenuToggle(goal.id, e)}
              >
                <FiMoreVertical />
                <AnimatePresence>
                  {menuOpenId === goal.id && (
                    <motion.div
                      className="context-menu"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => {
                        setSelectedGoal(goal);
                        setIsEditing(true);
                      }}>
                        <FiEdit /> Изменить
                      </button>
                      <button onClick={() => {
                        setSelectedGoal(goal);
                        setIsEditing(false);
                      }}>
                        <FiEye /> Просмотреть
                      </button>
                      <button onClick={() => {
                        setGoals(goals.map(g => 
                          g.id === goal.id 
                            ? { ...g, status: 'completed' as GoalStatus } 
                            : g
                        ));
                      }}>
                        <FiCheck /> Завершить
                      </button>
                      <button 
                        className="danger"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <FiTrash2 /> Удалить
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence>
                {expandedGoals.has(goal.id) && (
                  <motion.div
                    className="goal-tasks-list"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="tasks-header">
                      <div>Статус</div>
                      <div>Название</div>
                      <div>Приоритет</div>
                      <div>Дедлайн</div>
                    </div>
                    
                    {goal.tasks.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                    
                    <button 
                      className="add-task-btn"
                      onClick={() => handleAddTask(goal.id)}
                    >
                      <FiPlus /> Добавить задачу
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {(isCreating || isEditing) && selectedGoal && (
        <div className="goal-modal-overlay">
          <div className="goal-modal">
            <button className="close-btn" onClick={() => {
              setIsCreating(false);
              setIsEditing(false);
              setSelectedGoal(null);
            }}>
              <FiX />
            </button>
            
            <h2>{isCreating ? 'Новая цель' : 'Редактирование цели'}</h2>
            
            <div className="form-group">
              <label>Название цели *</label>
              <input
                type="text"
                value={selectedGoal.title}
                onChange={(e) => setSelectedGoal({
                  ...selectedGoal,
                  title: e.target.value
                })}
                placeholder="Введите название цели"
              />
            </div>
            
            <div className="form-group">
              <label>Описание</label>
              <textarea
                value={selectedGoal.description}
                onChange={(e) => setSelectedGoal({
                  ...selectedGoal,
                  description: e.target.value
                })}
                placeholder="Опишите вашу цель"
                rows={3}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Тип цели</label>
                <select
                  value={selectedGoal.type}
                  onChange={(e) => setSelectedGoal({
                    ...selectedGoal,
                    type: e.target.value as GoalType
                  })}
                >
                  {Object.entries(goalTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Приоритет</label>
                <select
                  value={selectedGoal.priority}
                  onChange={(e) => setSelectedGoal({
                    ...selectedGoal,
                    priority: e.target.value as GoalPriority
                  })}
                >
                  {Object.entries(goalPriorities).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Статус</label>
                <select
                  value={selectedGoal.status}
                  onChange={(e) => setSelectedGoal({
                    ...selectedGoal,
                    status: e.target.value as GoalStatus
                  })}
                >
                  {Object.entries(goalStatuses).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Цвет маркера</label>
                <div className="color-picker">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${selectedGoal.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedGoal({
                        ...selectedGoal,
                        color
                      })}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Целевая дата</label>
                <input
                  type="date"
                  value={selectedGoal.targetDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setSelectedGoal({
                    ...selectedGoal,
                    targetDate: e.target.value ? new Date(e.target.value) : undefined
                  })}
                />
              </div>
            </div>
            
            <div className="tasks-section">
              <h3>Задачи цели</h3>
              
              {selectedGoal.tasks.map(task => (
                <div key={task.id} className="task-row">
                  <select
                    value={task.status}
                    onChange={(e) => handleTaskChange(selectedGoal.id, task.id, { 
                      status: e.target.value as any,
                      completed: e.target.value === 'completed'
                    })}
                  >
                    {Object.entries(taskStatuses).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleTaskChange(selectedGoal.id, task.id, { 
                      title: e.target.value 
                    })}
                    placeholder="Название задачи"
                  />
                  
                  <select
                    value={task.priority}
                    onChange={(e) => handleTaskChange(selectedGoal.id, task.id, { 
                      priority: e.target.value as any 
                    })}
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                  
                  <input
                    type="date"
                    value={task.deadline?.toISOString().split('T')[0] || ''}
                    onChange={(e) => handleTaskChange(selectedGoal.id, task.id, { 
                      deadline: e.target.value ? new Date(e.target.value) : undefined 
                    })}
                  />
                </div>
              ))}
              
              <button 
                className="add-task-btn"
                onClick={() => handleAddTask(selectedGoal.id)}
              >
                <FiPlus /> Добавить задачу
              </button>
            </div>
            
            <div className="form-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setSelectedGoal(null);
                }}
              >
                Отмена
              </button>
              <button
                className="save-btn"
                onClick={() => handleSaveGoal(selectedGoal)}
                disabled={!selectedGoal.title}
              >
                {isCreating ? 'Создать цель' : 'Сохранить изменения'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}