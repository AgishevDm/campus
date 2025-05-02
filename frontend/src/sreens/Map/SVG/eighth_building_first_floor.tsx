import { RoutePoint } from "../../../types/map";
import React, { useState, useMemo } from 'react';
import ladderIcon from "./лестница.png";
import elevatorIcon from "./лифт.png";
import womentoiletIcon from "./туалет.png";
import buffetIcon from "./буфет.png";
import libraryIcon from "./библиотека.png";
import wardrobeIcon from "./гардероб.png";

interface EighthBuildingFirstFloorProops {
    onBackClick: () => void;
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
    pathPoints?: RoutePoint[]; // Точки для отрисовки пути
  }

  // Тип для узла в алгоритме поиска пути
  interface PathNode {
    x: number;
    y: number;
    g: number;
    h: number;
    f: number;
    parent: PathNode | null; // Явно указываем null вместо undefined
}

  export const EighthBuildingFirstFloor: React.FC<EighthBuildingFirstFloorProops> = ({
    onBackClick, 
    onRoomClick = () => {},
    highlightedRooms = [],
    routePath,
    pathPoints = []
  }) => {

    const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

    const obstacles = [
        // Комнаты верхнего ряда (1-4)
        { x: 240, y: 100, width: 40, height: 100 },  // room-2-1
        { x: 280, y: 100, width: 40, height: 100 },  // room-3-1
        { x: 320, y: 100, width: 40, height: 100 },  // room-4-1
        
        // Комнаты нижнего ряда (5-10)
        { x: 200, y: 250, width: 70, height: 90 },   // room-5-1
        { x: 270, y: 250, width: 50, height: 90 },   // room-6-1
        { x: 320, y: 250, width: 40, height: 90 },   // room-7-1
        { x: 360, y: 250, width: 40, height: 90 },   // room-8-1
        { x: 400, y: 250, width: 40, height: 90 },   // room-9-1
        { x: 440, y: 250, width: 40, height: 90 },   // room-10-1
        
        // Большие комнаты справа (11-18)
        { x: 480, y: 200, width: 100, height: 100 }, // room-11-1
        { x: 580, y: 200, width: 40, height: 100 },  // room-12-1
        { x: 960, y: 200, width: 40, height: 100 },  // room-13-1
        { x: 1000, y: 200, width: 100, height: 100 },// room-14-1
        { x: 1150, y: 250, width: 100, height: 90 }, // room-15-1
        { x: 1250, y: 250, width: 70, height: 90 },  // room-16-1
        { x: 1320, y: 250, width: 70, height: 90 },  // room-17-1
        { x: 1390, y: 250, width: 100, height: 90 }, // room-18-1
        
        // Комнаты в левой части (19-24)
        { x: 1390, y: 50, width: 100, height: 150 }, // room-19-1
        { x: 1320, y: 50, width: 70, height: 150 },  // room-20-1
        { x: 1250, y: 100, width: 70, height: 100 }, // room-21-1
        { x: 990, y: 50, width: 110, height: 100 },  // room-22-1
        { x: 920, y: 50, width: 70, height: 100 },   // room-23-1
        { x: 480, y: 50, width: 190, height: 100 },  // room-24-1
        
        // Специальные объекты
        { x: 400, y: 100, width: 40, height: 100 },  // elevator-1
        { x: 50, y: 50, width: 150, height: 150 },   // dining-1 (столовая)
        { x: 360, y: 100, width: 40, height: 100 },  // ladder-1 (лестница)
        { x: 620, y: 200, width: 100, height: 100 }, // wardrobe-1 (гардероб)
        { x: 860, y: 200, width: 100, height: 100 }, // wardrobe-2 (гардероб)
        { x: 1100, y: 250, width: 50, height: 90 },  // library-2 (библиотека)
        { x: 1180, y: 100, width: 40, height: 100 }, // ladder-2 (лестница)
        { x: 1220, y: 100, width: 30, height: 100 }, // womentoilet-2 (туалет)
        { x: 1150, y: 100, width: 30, height: 100 }, // elevator-2
        { x: 820, y: 50, width: 100, height: 70 }    // ladder-3 (лестница)
    ];

    console.log('Компонент EighthBuildingFirstFloor инициализирован');
    console.log('Загружено препятствий:', obstacles.length);

    // Проверяет, находится ли точка внутри препятствия
    const isPointInObstacle = (x: number, y: number) => {
        return obstacles.some(obs => 
            x >= obs.x && x <= obs.x + obs.width &&
            y >= obs.y && y <= obs.y + obs.height
        );
        
    };

    // Проверяет, пересекает ли линия между двумя точками препятствие
    const lineIntersectsObstacle = (x1: number, y1: number, x2: number, y2: number) => {
        console.log(`Проверка пересечения линии от [${x1}, ${y1}] до [${x2}, ${y2}]`);
        // Упрощенная проверка - в реальном проекте используйте более точный алгоритм
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            if (isPointInObstacle(x, y)) return true;
        }
        return false;
    };

    const findPathAStar = (start: {x: number, y: number}, end: {x: number, y: number}) => {
        console.log('--- Оптимизированный A* ---');
        
        // Увеличиваем шаг сетки для больших помещений
        const gridSize = 20; // Увеличили с 10 до 20px
        const maxSteps = 500; // Лимит итераций для безопасности
        // Ключевые точки коридора (основные повороты)
        
        const corridorMainPoints = [
            {x: 100, y: 225},   // Отступ от левой стены
            {x: 150, y: 225},   // Отступ от левой стены
            {x: 200, y: 225},   // Отступ от левой стены
            {x: 250, y: 225},   // Отступ от левой стены
            {x: 440, y: 225},   // Перед поворотом к лифтам
            {x: 440, y: 175},   // Спуск к центральной зоне
            {x: 720, y: 175},   // Центральный хаб (горизонталь)
            {x: 720, y: 225},   // Подъем к правому крылу 
            {x: 1150, y: 225},  // Правое крыло
            {x: 1200, y: 225},  // Правое крыло
            {x: 1250, y: 225},  // Правое крыло
            {x: 1300, y: 225},  // Правое крыло
            {x: 1350, y: 225},  // Правое крыло
            {x: 1400, y: 225},  // Правое крыло
            {x: 1450, y: 225},  // Правое крыло
            {x: 1100, y: 175},
            {x: 800, y: 175}, 
            {x: 830, y: 175}, // Спуск к нижнему уровню
            {x: 880, y: 175},   // Средний узел
            {x: 880, y: 135},   // Поворот к лестнице
            {x: 820, y: 135},   // Перед туалетом
            {x: 820, y: 90}, 
            {x: 1000, y: 175},   // Спуск к нижнему уровню
            {x: 840, y: 90},    // Обход угла
            {x: 840, y: 60},    // Нижняя точка
            {x: 720, y: 60},    // Горизонтальный проход
            {x: 720, y: 100},   // Подъем к левому крылу
            {x: 480, y: 100},   // Левое крыло нижнего уровня
            {x: 480, y: 175}    // Возврат в центральный хаб
        ];
    
        // Проверка прямой видимости (можем ли пройти напрямую без препятствий)
        const hasDirectLine = !lineIntersectsObstacle(start.x, start.y, end.x, end.y);
        if (hasDirectLine) {
            console.log('Прямой путь без препятствий');
            return [start, end];
        }
    
        // Находим ближайшие точки входа в коридор
        const startCorridor = findNearestCorridorPoint(start, corridorMainPoints);
        const endCorridor = findNearestCorridorPoint(end, corridorMainPoints);
        
        // Если обе точки около одного коридорного сегмента
        if (Math.abs(startCorridor.x - endCorridor.x) < 100 && 
            Math.abs(startCorridor.y - endCorridor.y) < 100) {
            console.log('Короткий путь через один сегмент коридора');
            return [start, startCorridor, endCorridor, end];
        }
    
        // Оптимизированный A* только по ключевым точкам коридора
        const openSet: PathNode[] = [];
        const closedSet: PathNode[] = [];
        
        const startNode: PathNode = {
            x: startCorridor.x,
            y: startCorridor.y,
            g: 0,
            h: heuristic(startCorridor, endCorridor),
            f: 0,
            parent: null
        };
        startNode.f = startNode.g + startNode.h;
        openSet.push(startNode);
    
        let steps = 0;
        while (openSet.length > 0 && steps++ < maxSteps) {
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift()!;
            closedSet.push(current);
    
            // Проверка достижения цели
            if (Math.abs(current.x - endCorridor.x) < gridSize && 
                Math.abs(current.y - endCorridor.y) < gridSize) {
                console.log('Путь через коридор найден');
                return buildFullPath(start, end, current, corridorMainPoints);
            }
    
            // Генерируем соседей только из ключевых точек коридора
            const neighbors = corridorMainPoints
                .filter(p => !isSamePoint(p, current))
                .map(p => ({
                    point: p,
                    cost: heuristic(current, p)
                }))
                .sort((a, b) => a.cost - b.cost)
                .slice(0, 3); // Берем только 3 ближайшие точки
    
            for (const {point} of neighbors) {
                if (closedSet.some(n => isSamePoint(n, point))) continue;
                
                // Проверяем нет ли препятствий между текущей точкой и соседом
                if (lineIntersectsObstacle(current.x, current.y, point.x, point.y)) continue;
                
                const gScore = current.g + heuristic(current, point);
                const existing = openSet.find(n => isSamePoint(n, point));
                
                if (!existing) {
                    openSet.push({
                        x: point.x,
                        y: point.y,
                        g: gScore,
                        h: heuristic(point, endCorridor),
                        f: gScore + heuristic(point, endCorridor),
                        parent: current
                    });
                } else if (gScore < existing.g) {
                    existing.g = gScore;
                    existing.f = gScore + existing.h;
                    existing.parent = current;
                }
            }
        }
    
        console.warn('Оптимизированный A* не нашел путь, возвращаем прямой маршрут');
        return [start, end];
    };

   // Вспомогательные функции
    const heuristic = (a: {x: number, y: number}, b: {x: number, y: number}) => {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Манхэттенское расстояние
    };

    const isSamePoint = (a: {x: number, y: number}, b: {x: number, y: number}) => {
        return Math.abs(a.x - b.x) < 5 && Math.abs(a.y - b.y) < 5;
    };

    const findNearestCorridorPoint = (point: {x: number, y: number}, corridorPoints: {x: number, y: number}[]) => {
        let nearest = corridorPoints[0];
        let minDist = Infinity;
        
        for (const p of corridorPoints) {
            const dist = heuristic(point, p);
            if (dist < minDist) {
                minDist = dist;
                nearest = p;
            }
        }
        return nearest;
    };

    const buildFullPath = (start: {x: number, y: number}, 
                        end: {x: number, y: number}, 
                        endNode: PathNode | null,
                        corridorPoints: {x: number, y: number}[]) => {
        const path: {x: number, y: number}[] = [];
        
        // Собираем путь от конца к началу
        let current = endNode;
        while (current) {
            path.unshift({x: current.x, y: current.y});
            current = current.parent;
        }
        
        // Упрощаем путь, оставляя только ключевые точки
        const simplifiedPath = simplifyPath([start, ...path, end], corridorPoints);
        return simplifiedPath;
    };

    const simplifyPath = (path: {x: number, y: number}[], corridorPoints: {x: number, y: number}[]) => {
        if (path.length <= 2) return path;
        
        const result = [path[0]];
        let lastAdded = 0;
        
        for (let i = 1; i < path.length - 1; i++) {
            // Проверяем, является ли точка ключевой точкой коридора
            const isMainPoint = corridorPoints.some(p => 
                Math.abs(p.x - path[i].x) < 5 && Math.abs(p.y - path[i].y) < 5);
            
            // Если между последней добавленной точкой и текущей нет препятствий
            const canSkip = !lineIntersectsObstacle(
                result[result.length-1].x, result[result.length-1].y,
                path[i+1].x, path[i+1].y
            );
            
            if (isMainPoint || !canSkip) {
                result.push(path[i]);
                lastAdded = i;
            }
        }
        
        result.push(path[path.length-1]);
        return result;
    }; 

    const allRooms = [ { id: "room-1-1", points: "200,100 200,200 240,200 240,100", number: "1", x: 220, y: 150, entrance :{ x: 220, y: 200 }},
        { id: "room-2-1", points: "240,100 240,200 280,200 280,100", number: "2", x: 260, y: 150, entrance :{ x: 260, y: 200 }},
        { id: "room-3-1", points: "280,100 280,200 320,200 320,100", number: "3", x: 300, y: 150, entrance :{ x: 300, y: 200 }},
        { id: "room-4-1", points: "320,100 320,200 360,200 360,100", number: "4", x: 340, y: 150, entrance :{ x: 340, y: 200 }},
        { id: "room-5-1", points: "200,250 200,340 270,340 270,250", number: "5", x: 235, y: 300, entrance :{ x: 235, y: 250 }},
        { id: "room-6-1", points: "270,250 270,340 320,340 320,250", number: "6", x: 290, y: 300, entrance :{ x: 290, y: 250 }},
        { id: "room-7-1", points: "320,250 320,340 360,340 360,250", number: "7", x: 345, y: 300, entrance :{ x: 345, y: 250 }},
        { id: "room-8-1", points: "360,250 360,340 400,340 400,250", number: "8", x: 380, y: 300, entrance :{ x: 380, y: 250 }},
        { id: "room-9-1", points: "400,250 400,340 440,340 440,250", number: "9", x: 420, y: 300, entrance :{ x: 420, y: 250 }},
        { id: "room-10-1", points: "440,250 440,340 480,340 480,250", number: "10", x: 460, y: 300, entrance :{ x: 460, y: 250 }},
        { id: "room-11-1", points: "480,200 480,300 580,300 580,200", number: "11", x: 530, y: 250, entrance :{ x: 530, y: 200 }},
        { id: "room-12-1", points: "580,200 580,300 620,300 620,200", number: "12", x: 600, y: 250, entrance :{ x: 600, y: 200 }},
        { id: "room-13-1", points: "960,200 960,300 1000,300 1000,200", number: "13", x: 980, y: 250, entrance :{ x: 980, y: 200 }},
        { id: "room-14-1", points: "1000,200 1000,300 1100,300 1100,200", number: "14", x: 1050, y: 250, entrance :{ x: 1050, y: 200 }},
        { id: "room-15-1", points: "1150,250 1150,340 1250,340 1250,250", number: "15", x: 1200, y: 300, entrance :{ x: 1200, y: 250 }},
        { id: "room-16-1", points: "1250,250 1250,340 1320,340 1320,250", number: "16", x: 1280, y: 300, entrance :{ x: 1280, y: 250 }},
        { id: "room-17-1", points: "1320,250 1320,340 1390,340 1390,250", number: "17", x: 1360, y: 300, entrance :{ x: 1360, y: 250 }},
        { id: "room-18-1", points: "1390,250 1390,340 1490,340 1490,250", number: "18", x: 1450, y: 300, entrance :{ x: 1450, y: 250 }},
        { id: "room-19-1", points: "1390,50 1390,200 1490,200 1490,50", number: "19", x: 1440, y: 120, entrance :{ x: 1440, y: 200 }},
        { id: "room-20-1", points: "1320,50 1320,200 1390,200 1390,50", number: "20", x: 1355, y: 120, entrance :{ x: 1355, y: 200 }},
        { id: "room-21-1", points: "1250,100 1250,200 1320,200 1320,100", number: "21", x: 1280, y: 150, entrance :{ x: 1280, y: 200 }},
        { id: "room-22-1", points: "990,50 990,150 1100,150 1100,50", number: "22", x: 1050, y: 130, entrance :{ x: 1050, y: 150 }},
        { id: "room-23-1", points: "920,50 920,150 990,150 990,50", number: "23", x: 950, y: 100, entrance :{ x: 950, y: 150 }},
        { id: "room-24-1", points: "480,50 480,150 670,150 670,50", number: "24", x: 550, y: 100, entrance :{ x: 550, y: 150 }},
        { id: "elevator-1", points: "400,100 400,200 440,200 440,100", number: "", x: 550, y: 100, entrance :{ x: 420, y: 200 }},
        { id: "dining-1", points: "50,50 50,200 200,200 200,90 150,90 150,50", number: "", x: 550, y: 100, entrance :{ x: 200, y: 200 }},
        { id: "ladder-1", points: "360,100 360,200 400,200 400,100", number: "", x: 550, y: 100, entrance :{ x: 380, y: 200 }},
        { id: "wardrobe-1", points: "620,200 620,300 720,300 720,200", number: "", x: 550, y: 100, entrance :{ x: 680, y: 200 }},
        { id: "wardrobe-2", points: "860,200 860,300 960,300 960,200", number: "", x: 550, y: 100, entrance :{ x: 920, y: 200 }},
        { id: "library-2", points: "1100,250 1100,340 1150,340 1150,250", number: "", x: 550, y: 100, entrance :{ x: 1125, y: 250 }},
        { id: "ladder-2", points: "1180,100 1180,200 1220,200 1220,100", number: "", x: 550, y: 100, entrance :{ x: 1200, y: 200 }},
        { id: "womentoilet-2", points: "1220,100 1220,200 1250,200 1250,100", number: "", x: 550, y: 100, entrance :{ x: 1240, y: 200 }},
        { id: "elevator-2", points: "1150,100 1150,200 1180,200 1180,100", number: "", x: 550, y: 100, entrance :{ x: 1165, y: 200 }},
        { id: "ladder-3", points: "820,80 880,80 880,50 920,50 920,150 880,150 880,120 820,120", number: "", x: 550, y: 100, entrance :{ x: 820, y: 100 }},
        ];

    const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        const target = e.target as SVGPolygonElement;
        
        if (target?.id) {
            console.log(`Выбран элемент с ID: ${target.id}`);
            setSelectedRooms(prev => {
                const newSelection = prev.includes(target.id)
                    ? prev.filter(id => id !== target.id)
                    : prev.length < 2 
                        ? [...prev, target.id] 
                        : [prev[1], target.id];
                console.log('Новый выбор комнат:', newSelection);
                return newSelection;
            });
        }
    };
    
    const currentPathPoints = useMemo(() => {
        console.log('Выбранные комнаты:', selectedRooms);
        if (selectedRooms.length !== 2) 
            {
                console.log('Выбрано не 2 комнаты, путь не строится');
                return [];
            }
        
        const startRoom = allRooms.find(r => r.id === selectedRooms[0]);
        const endRoom = allRooms.find(r => r.id === selectedRooms[1]);
        
        if (!startRoom || !endRoom) 
            {
                console.log('Не удалось найти одну из комнат');
                return [];
            }

        console.log('Построение пути между:', startRoom.id, 'и', endRoom.id);
        console.log('Вход в стартовую комнату:', startRoom.entrance);
        console.log('Вход в конечную комнату:', endRoom.entrance);
        
        // Ищем путь с учетом препятствий
        const path = findPathAStar(startRoom.entrance, endRoom.entrance);
        
        // Добавляем флаги для точек (в коридоре или нет)
        return path.map((point, index) => ({
            ...point,
            inCorridor: index > 0 && index < path.length - 1
        }));
    }, [selectedRooms]);

    const getHighlightClass = (id: string) => 
        highlightedRooms.includes(id) || selectedRooms.includes(id) 
            ? 'highlighted' 
            : '';

    const renderRoute = () => {
        if (!currentPathPoints.length) return null;

        return (
            <>
                <polyline
                    points={currentPathPoints.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#4285F4"
                    strokeWidth="5"
                    strokeDasharray="10,5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
                {currentPathPoints
                    .filter(p => !p.inCorridor)
                    .map((p, i) => (
                    <circle
                        key={`marker-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#FFF"
                        stroke="#4285F4"
                        strokeWidth="2"
                />
                ))}
            </>
        );
    };

    return(
        <svg onClick={handleSvgClick}>
        <rect width="100%" height="100%" fill="#f0f0f0" />
        
     <polygon
        id="corridor-1"
        className={`corridor ${getHighlightClass('corridor-1')}`}
        points="50,200 50,250 480,250 480,200 720,200 720,260 760,260 760,300 820,300 
        820,260 860,260 860,200 1100,200 1100,250 1490,250 1490,200 1150,200 1150,100 
        1100,100 1100,150 880,150 880,120 820,120 820,80 880,80 880,50 720,50 720,150 
        480,150 480,100 440,100 440,200"
        fill="#f9f9ff"
        stroke="#6633FF"
        strokeWidth="1"
        data-type="corridor"
        data-floor="1"
      />

        {allRooms.map(room => (
        <g key={room.id}>
          <polygon
            id={room.id}
            className={`room ${getHighlightClass(room.id)}`}
            points={room.points}
            fill="#E0E0E0"
            stroke="black"
            strokeWidth="1"
            data-type="classroom"
            data-floor="1"
            data-number={room.number}
          />
          <text
            x={room.x}
            y={room.y}
            fontFamily="'Roboto', sans-serif"
            fill="black"
            fontSize="18"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {room.number}
          </text>
        </g>
      ))}

   
    <text x="100" y="230" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>

      <polygon
        id="dining-1"
        className={`dining ${getHighlightClass('dining-1')}`}
        points="50,50 50,200 200,200 200,90 150,90 150,50"
        fill="#FF6F61"
        stroke="#6B4226"
        strokeWidth="1"
        data-type="dining"
        data-floor="1"
      />
      <image 
        href={buffetIcon} 
        x="100" y="130" 
        width="30" height="30"
        data-associated-with="dining-1"
      />

    <polygon 
        id="ladder-1"
        className={`ladder ${getHighlightClass('ladder-1')}`} 
        points="360,100 360,200 400,200 400,100" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <image 
        href={ladderIcon}
        x="365" y="140" 
        width="30" height="30" 
        data-associated-with="ladder-1"/>

    <polygon 
        points="150,100 210,100 210,50 150,50" 
        fill="#FF6F61" stroke="#6B4226" stroke-width="1"  />

    <polygon 
        points="210,100 240,100 240,50 210,50" 
        fill="#FF6F61" stroke="#6B4226" stroke-width="1" />

    <polygon
        points="50,250 50,340 200,340 200,250" 
        fill="#FF6F61" stroke="#6B4226" stroke-width="1"  />

    <polygon 
        id="elevator-1" 
        className={`elevator ${getHighlightClass('elevator-1')}`}
        points="400,100 400,200 440,200 440,100" 
        fill="rgb(121, 120, 120)" 
        stroke="black" 
        stroke-width="1" 
        data-type="elevator"
        data-floor="1"/>
    <image 
        href={elevatorIcon} 
        x="405" y="140" 
        width="30" height="30" 
        data-associated-with="elevator-1"/>

    <polygon 
        id="wardrobe-1" 
        className={`wardrobe ${getHighlightClass('wardrobe-1')}`} 
        points="620,200 620,300 720,300 720,200" 
        fill="#6C5B7B" 
        stroke="black" 
        stroke-width="1" 
        data-type="wardrobe"
        data-floor="1"/>
    <image 
        href={wardrobeIcon} 
        x="655" y="240" 
        width="30" height="30" 
        data-associated-with="wardrobe-1"/>   

    <polygon 
        id="wardrobe-2" 
        className={`wardrobe ${getHighlightClass('wardrobe-2')}`}  
        points="860,200 860,300 960,300 960,200" 
        fill="#6C5B7B" 
        stroke="black" 
        stroke-width="1" 
        data-type="wardrobe"
        data-floor="1"/>
    <image 
        href={wardrobeIcon} 
        x="895" y="240" 
        width="30" height="30" 
        data-associated-with="wardrobe-2"/>

    <polygon 
        id="library-2" 
        className={`library ${getHighlightClass('library-2')}`}  
        points="1100,250 1100,340 1150,340 1150,250" 
        fill="#D4A373" 
        stroke="black" 
        stroke-width="1" 
        data-type="library"
        data-floor="1"/>
    <image 
        href={libraryIcon} 
        x="1110" y="280" 
        width="30" height="30" 
        data-associated-with="library-2"/>

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`} 
        points="1180,100 1180,200 1220,200 1220,100" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <image 
        href={ladderIcon} 
        x="1185" y="140" 
        width="30" height="30" 
        data-associated-with="ladder-2"/>    

    <polygon 
        id="womentoilet-2" 
        className={`womentoilet ${getHighlightClass('womentoilet-2')}`} 
        points="1220,100 1220,200 1250,200 1250,100" 
        fill=" #F4C2C2" 
        stroke="black" 
        stroke-width="1" 
        data-type="womentoilet"
        data-floor="1"/>
    <image 
        href={womentoiletIcon} 
        x="1220" y="140" 
        width="30" height="30" 
        data-associated-with='womentoilet-2'/>    

    <polygon 
        id="elevator-2" 
        className={`elevator ${getHighlightClass('elevator-2')}`}
        points="1150,100 1150,200 1180,200 1180,100" 
        fill="rgb(121, 120, 120)" 
        stroke="black" 
        stroke-width="1" 
        data-type="elevator"
        data-floor="1"/>
    <image 
        href={elevatorIcon} 
        x="1150" y="140" 
        width="30" height="30" 
        data-associated-with="elevator-1"/>    
    
    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`} 
        points="820,80 880,80 880,50 920,50 920,150 880,150 880,120 820,120" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <image 
        href={ladderIcon}
        x="830" y="85" 
        width="30" height="30" 
        data-associated-with="ladder-3"/>

    <polygon 
        points="720,260 720,300 760,300 760,260" 
        fill=" #E0E0E0" stroke="black" stroke-width="1" />

    <polygon 
        points="820,260 820,300 860,300 860,260" 
        fill=" #E0E0E0" stroke="black" stroke-width="1" />

    <polygon id="кабинет" 
        className="кабинеты" 
        points="1390,280 1390,340 1440,340 1440,280" 
        fill=" #E0E0E0" stroke="black" stroke-width="1" />
    <text x="1420" y="300" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">?</text>

    <polygon id="кабинет" 
        className="кабинеты" 
        points="1070,50 1070,110 1100,110 1100,50" 
        fill=" #E0E0E0" stroke="black" stroke-width="1" />
    <text x="1080" y="80" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">?</text>

    <polygon id="кабинет" 
        className="кабинеты" 
        points="1040,50 1040,110 1070,110 1070,50" 
        fill=" #E0E0E0" stroke="black" stroke-width="1" />
    <text x="1050" y="80" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">?</text>

    <polygon id="кабинет" 
        className="кабинеты" 
        points="670,50 670,150 720,150 720,50" 
        fill=" #E0E0E0" stroke="black" stroke-width="1" />

    <polygon
        points="50,50 50,340 480,340 480,300 1100,300 1100,340 
        1490,340 1490,50 1320,50 1320,100 1100,100 1100,50 480,50 480,100 
        240,100 240,50" 
        fill="none" stroke="black" stroke-width="2" />
    {renderRoute()}
    </svg>
    );
};
