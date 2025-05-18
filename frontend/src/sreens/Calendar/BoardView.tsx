import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Task } from './TaskView';
import { SortableItem } from './SortableItem';
import './BoardView.scss';

type Column = {
  id: string;
  title: string;
  status: Task['status'];
};

const columns: Column[] = [
  { id: 'todo', title: 'Сделать', status: 'todo' },
  { id: 'inProgress', title: 'В процессе', status: 'inProgress' },
  { id: 'done', title: 'Сделано', status: 'done' },
  { id: 'completed', title: 'Завершена', status: 'completed' }
];

type BoardViewProps = {
  tasks: Task[];
  onTaskUpdate: (updatedTasks: Task[]) => void;
};

export function BoardView({ tasks, onTaskUpdate }: BoardViewProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [localTasks, setLocalTasks] = useState(tasks);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const activeTask = localTasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Определение целевой колонки
    const getColumnStatus = (id: UniqueIdentifier): Task['status'] => {
      if (id.toString().startsWith('empty')) {
        return columns.find(c => c.id === id.toString().split('-')[1])?.status || activeTask.status;
      }
      const task = localTasks.find(t => t.id === id);
      return task?.status || 
        columns.find(c => c.id === id)?.status || 
        activeTask.status;
    };

    const targetStatus = getColumnStatus(over.id);
    
    // Поиск индексов
    const oldIndex = localTasks.findIndex(t => t.id === active.id);
    let newIndex = localTasks.findIndex(t => t.id === over.id);

    // Если перемещение в другую колонку
    if (activeTask.status !== targetStatus) {
      const targetColumnTasks = localTasks
        .filter(t => t.status === targetStatus)
        .map(t => t.id);
      
      newIndex = targetColumnTasks.length;
    }

    const updatedTask = {
      ...activeTask,
      status: targetStatus,
      completedAt: targetStatus === 'completed' ? new Date().toISOString() : undefined
    };

    // Создаем новый массив задач
    const newTasks = localTasks.filter(task => task.id !== active.id);
    newTasks.splice(newIndex, 0, updatedTask);

    setLocalTasks(newTasks);
    onTaskUpdate(newTasks);
    setActiveId(null);
  };

  const getTasksByStatus = (status: Task['status']) => 
    localTasks.filter(task => task.status === status);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="board-container">
        {columns.map(column => {
          const tasksInColumn = getTasksByStatus(column.status);
          return (
            <div 
              key={column.id} 
              className="column"
              data-column-id={column.id}
              data-status={column.status}
            >
              <div className={`column-header ${column.status}`}>
                {column.title}
              </div>
              <SortableContext 
                id={column.id}
                items={tasksInColumn}
                strategy={verticalListSortingStrategy}
              >
                {tasksInColumn.map(task => (
                  <SortableItem 
                    key={task.id} 
                    id={task.id}
                    data={{ type: 'task', task }}
                  >
                    <div className="task-card">
                      <div className="color-overlay" 
                          style={{ backgroundColor: task.color }} />
                      <div className="task-content">
                        <div className="task-title">{task.title}</div>
                        <div className="task-meta">
                          <span>#{task.number}</span>
                          {task.deadline && (
                            <span className="task-deadline">
                              {new Date(task.deadline).toLocaleDateString('ru-RU')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </SortableItem>
                ))}
                
                {/* Пустая область для дропа */}
                <SortableItem 
                  id={`empty-${column.id}`} 
                  data={{ type: 'column', column }}
                >
                  <div 
                    className="empty-drop-area" 
                    style={{ 
                      minHeight: tasksInColumn.length === 0 ? '100px' : '50px',
                      opacity: tasksInColumn.length === 0 ? 1 : 0.5
                    }}
                  />
                </SortableItem>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="task-card" style={{ 
            transform: 'scale(1.05) rotate(2deg)',
            backgroundColor: localTasks.find(t => t.id === activeId)?.color 
          }}>
            <div className="task-content">
              <div className="task-title">
                {localTasks.find(t => t.id === activeId)?.title}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}