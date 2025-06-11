import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import {FirstBuildingFirstFloor}  from './SVG/first_building_first_floor';
import {TwelfthBuildingFirstFloor} from './SVG/twelfth_building_first_floor';
import {EighthBuildingFirstFloor} from './SVG/eighth_building_first_floor';
import {TwelfthBuildingSecondFloor} from './SVG/twelfth_building_second_floor';
import {FirstBuildingSecondFloor} from './SVG/first_building_second_floor';
import {FirstBuildingThirdFloor} from './SVG/first_building_third_floor';
import {FirstBuildingFourthFloor} from './SVG/first_building_fourth_floor';
import { TwelfthBuildingThirdFloor } from './SVG/twelfth_building_third_floor';
import { EighthBuildingSecondFloor } from  './SVG/eighth_building_second_floor';
import { EighthBuildingThirdFloor } from './SVG/eighth_building_third_floor';
import { EighthBuildingFourthFloor } from './SVG/eighth_building_fourth_floor';
import { EighthBuildingFifthFloor } from './SVG/eighth_building_fifth_floor';
import { EighthBuildingSixthFloor } from './SVG/eighth_building_sixth_floor';
import { EighthBuildingSeventhFloor } from './SVG/eighth_building_seventh_floor';
import { FiveBuildingFirstFloor } from './SVG/five_building_first_floor';
import { FiveBuildingSecondFloor } from './SVG/five_building_second_floor';
import { SecondBuildingGroundFloor } from './SVG/second_building_ground_floor';
import { SecondBuildingFirstFloor } from './SVG/second_building_first_floor';
import { SecondBuildingSecondFloor } from './SVG/second_building_second_floor';
import { SecondBuildingThirdFloor } from './SVG/second_building_third_floor';
import { SecondBuildingFourthFloor } from './SVG/second_building_fourth_floor';
import { roomsData } from '../../data/eighthBuildingData';
import { Pathfinder } from '../../utils/pathfinding';
import { GeneralMap } from './SVG/general_map';
import WeatherWidget from './WeatherWidget';
import { 
  FiSearch,
  FiChevronUp, 
  FiChevronDown, 
  FiX, 
  FiMapPin, 
  FiChevronRight, 
  FiChevronLeft, 
  FiNavigation, 
  FiMap, 
  FiPlus,
  FiMinus,
  FiRefreshCw,
  FiRotateCw,
  FiRotateCcw,
  FiArrowDown,
  FiClock,
  FiXCircle,
  FiChevronsRight
} from 'react-icons/fi';
import { TbMapShare } from "react-icons/tb";
import './Map.scss';
import { RoutePoint } from '../../types/map';

type Event = {
  id: string;
  title: string;
  time: string;
  endTime: string;
  location: string;
};

type MarkerData = {
  x: number;
  y: number;
  address: string;
  description: string;
  photos: string[];
  floor: number;
  building: 'general' | 'firstBuilding' | 'twelfthBuilding' | 'eighthBuilding' | 'fifthBuilding' | 'secondBuilding';
  svgX: number; // Координата X в SVG пространстве
  svgY: number; // Координата Y в SVG пространстве
  clientX: number; // Координата X в клиентском пространстве
  clientY: number; // Координата Y в клиентском пространстве
};

type RouteData = {
  duration: string;
  steps: string[];
};

export default function Map() {
  const [startQuery, setStartQuery] = useState('');
  const [endQuery, setEndQuery] = useState('');
  const [currentFloor, setCurrentFloor] = useState(3);
  const [isEventsOpen, setIsEventsOpen] = useState(true);
  const [isMobileEventsOpen, setIsMobileEventsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [marker, setMarker] = useState<MarkerData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(false);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [isMobilePanelCollapsed, setIsMobilePanelCollapsed] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const eventsPanelRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // Состояние для текущего компонента
  const [currentComponent, setCurrentComponent] = useState<'general' | 'firstBuilding' | 'twelfthBuilding' | 'eighthBuilding'| 'fifthBuilding'| 'secondBuilding'>('general');

  // Состояние для перемещения и масштабирования
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const pinchRef = useRef<{distance: number; scale: number; angle: number; rotation: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });

  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const LONG_PRESS_DURATION = 500;
  const [isLongPressing, setIsLongPressing] = useState(false);

  const [pathfinder, setPathfinder] = useState<Pathfinder | null>(null);
  const [pathPoints, setPathPoints] = useState<{x: number, y: number}[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<{start: string | null, end: string | null}>({
    start: null,
    end: null
  });

  const [events, setEvents] = useState<Event[]>([]);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Токен отсутствует');
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error('Ошибка при загрузке событий');
    }

    return response;
  };

  const loadEvents = async () => {
    try {
      const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/events/getAll`);
      const { formattedEvents } = await response.json();

      const now = new Date();

      const upcoming = formattedEvents
        .filter((e: any) =>
          isSameDay(parseISO(e.startEvent), now) &&
          ((e.endEvent ? parseISO(e.endEvent) : parseISO(e.startEvent)) >= now)
        )
        .sort(
          (a: any, b: any) =>
            parseISO(a.startEvent).getTime() - parseISO(b.startEvent).getTime()
        )
        .slice(0, 3)
        .map((e: any) => ({
          id: e.id,
          title: e.eventName,
          time: format(parseISO(e.startEvent), 'HH:mm'),
          endTime: e.endEvent ? format(parseISO(e.endEvent), 'HH:mm') : '',
          location: e.location,
        }));

      setEvents(upcoming);
    } catch (error) {
      console.error('Ошибка при загрузке событий', error);
    }
  };

  useEffect(() => {
    setPathfinder(new Pathfinder(roomsData));
  }, []);

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setDesktopSidebarVisible(false);
      return;
    }

    if (sidebarOpen) {
      setDesktopSidebarVisible(true);
    } else {
      const timer = setTimeout(() => setDesktopSidebarVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen, isMobile]);

  const handleRoomClick = (roomId: string) => {
    if (!pathfinder) return;
  
    const newSelection = {...selectedRooms};
    
    if (!newSelection.start) {
      newSelection.start = roomId;
    } else if (!newSelection.end && newSelection.start !== roomId) {
      newSelection.end = roomId;
      
      // Получаем точки и фильтруем некорректные
      const points = pathfinder.findPathWithPoints(
        newSelection.start,
        roomId,
        roomsData
      ).filter(p => 
        p.x >= 0 && p.x <= 2000 && 
        p.y >= 0 && p.y <= 2000
      );
      
      setPathPoints(points);
    } else {
      newSelection.start = roomId;
      newSelection.end = null;
    }
    
    setSelectedRooms(newSelection);
  };

  const smoothPath = (points: RoutePoint[]): RoutePoint[] => {
    if (points.length < 3) return points;
    
    const smoothed: RoutePoint[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      smoothed.push(points[i]);
      // Добавляем промежуточные точки между основными
      if (i < points.length - 2) {
        smoothed.push({
          x: (points[i].x + points[i+1].x) / 2,
          y: (points[i].y + points[i+1].y) / 2,
          inCorridor: points[i].inCorridor && points[i+1].inCorridor
        });
      }
    }
    smoothed.push(points[points.length-1]);
    
    return smoothed;
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (eventsPanelRef.current && 
      !eventsPanelRef.current.contains(e.target as Node) && 
      !(e.target as Element).closest('.panel-toggle')) {
      setIsMobileEventsOpen(false);
    }
  }, []);

  const handleMapClick = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
  
    // Проверка запрещенных элементов
    const forbiddenElements = [
      '.search-container', '.floor-navigation', '.events-panel',
      '.panel-toggle', '.map-marker', '.mobile-sidebar', '.desktop-sidebar',
      '.navigation'
    ];
  
    if (forbiddenElements.some(selector => target.closest(selector))) return;
  
    if (target.tagName === 'polygon' || target.tagName === 'text') {
      console.log('Здание clicked:', target.id);
      return;
    }
  
    const svg = svgRef.current;
    if (!svg) return;

    // Получаем координаты в зависимости от типа события
    let clientX: number;
    let clientY: number;

    if (e.nativeEvent instanceof MouseEvent) {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    } else if (e.nativeEvent instanceof TouchEvent && e.nativeEvent.touches.length > 0) {
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    } else {
      return;
    }
  
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;  
  
    try {
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      
      const newMarker = {
        x: svgP.x,
        y: svgP.y,
        address: 'Выбранная точка',
        description: 'Описание местоположения',
        photos: [],
        floor: currentFloor,
        building: currentComponent,
        svgX: svgP.x,
        svgY: svgP.y,
        clientX: clientX,
        clientY: clientY,
      };
      setMarker(newMarker);
      setRoute(null);
      setSidebarOpen(true);
      if (isMobile) setIsMobilePanelCollapsed(false);
      
      console.log('Новый маркер создан:', {
        position: { x: svgP.x, y: svgP.y },
        building: currentComponent,
        floor: currentFloor,
        screenPosition: { x: clientX, y: clientY },
        transform: { position, scale }
      });
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  };

  const handleAddPhoto = () => {
    if (!marker) return;
    const newPhoto = `${Math.random()}`;
    setMarker({ ...marker, photos: [...marker.photos, newPhoto] });
  };

  const calculateRoute = () => {
    setRoute({
      duration: '15 минут',
      steps: ['Пройдите прямо 100м', 'Поверните налево', 'Кабинет 101 справа']
    });
  };

  // Обработчик начала перемещения
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
  
  // таймер долгого нажатия
  const timer = setTimeout(() => {
    if (!isDragging) {
      setIsLongPressing(true);
      handleMapClick(e);
    }
  }, LONG_PRESS_DURATION);

    setLongPressTimer(timer);
    setIsDragging(false);
    setStartDragPos({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  };

  // Обработчик перемещения
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (longPressTimer) {
      const dx = e.clientX - (startDragPos.x + position.x);
      const dy = e.clientY - (startDragPos.y + position.y);
      
      // Если движение достаточно большое - это перетаскивание
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
        setIsDragging(true);
      }
    }
    
    if (isDragging) {
      setPosition({
        x: e.clientX - startDragPos.x,
        y: e.clientY - startDragPos.y,
      });
    }
  };

  // Обработчик окончания перемещения
  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setIsDragging(false);
    setIsLongPressing(false);
  };

  // Обработчик масштабирования
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    if (e.ctrlKey) {
      setRotation(prev => prev + (e.deltaY < 0 ? -5 : 5));
      return;
    }

    const delta = e.deltaY < 0 ? 1.1 : 0.9; // Увеличение или уменьшение масштаба
    const newScale = Math.min(Math.max(scale * delta, 0.5), 3); // Ограничение масштаба
    setScale(newScale);
  };

  const zoomIn = () => setScale(prev => Math.min(prev * 1.1, 3));
  const zoomOut = () => setScale(prev => Math.max(prev * 0.9, 0.5));
  const rotateLeft = () => setRotation(prev => prev - 15);
  const rotateRight = () => setRotation(prev => prev + 15);
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const getMarkerInfo = (): string => {
    if (!marker) return 'Маркер не установлен';
    
    return `
      Здание: ${getBuildingName(marker.building)}
      Этаж: ${marker.floor}
      Координаты SVG: (${marker.svgX.toFixed(1)}, ${marker.svgY.toFixed(1)})
      Координаты клиента: (${marker.clientX.toFixed(1)}, ${marker.clientY.toFixed(1)})
      Текущий масштаб: ${scale.toFixed(2)}
      Смещение карты: (${position.x.toFixed(1)}, ${position.y.toFixed(1)})
    `;
  };
  
  const getBuildingName = (building: string): string => {
    switch(building) {
      case 'general': return 'Общая карта';
      case 'firstBuilding': return '1 корпус';
      case 'twelfthBuilding': return '12 корпус';
      case 'eighthBuilding': return '8 корпус';
      case 'fifthBuilding': return '5 корпус';
      case 'secondBuilding': return '2 корпус';
      default: return building;
    }
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      pinchRef.current = { distance, scale, angle, rotation };
      return;
    }
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    
    // Таймер для долгого нажатия
    const timer = setTimeout(() => {
      if (!isDragging) {
        setIsLongPressing(true);
        handleMapClick(e);
      }
    }, LONG_PRESS_DURATION);

    setLongPressTimer(timer);
    setIsDragging(false);
    setStartDragPos({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
    
    e.preventDefault();
  };

  // Обработчик перемещения пальца
  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchRef.current) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const scaleFactor = distance / pinchRef.current.distance;
      const newScale = Math.min(Math.max(pinchRef.current.scale * scaleFactor, 0.5), 3);
      setScale(newScale);
      const angleDiff = angle - pinchRef.current.angle;
      setRotation(pinchRef.current.rotation + angleDiff * (180 / Math.PI));
      return;
    }
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    if (longPressTimer) {
      const dx = touch.clientX - (startDragPos.x + position.x);
      const dy = touch.clientY - (startDragPos.y + position.y);
      
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
        setIsDragging(true);
      }
    }

    if (isDragging) {
      setPosition({
        x: touch.clientX - startDragPos.x,
        y: touch.clientY - startDragPos.y,
      });
    }
    
    e.preventDefault();
  };

  const handleBuildingChange = (building: 'general' | 'firstBuilding' | 'twelfthBuilding' | 'eighthBuilding' | 'fifthBuilding' | 'secondBuilding') => {
    setCurrentComponent(building);
    setCurrentFloor(1); // Всегда сбрасываем на первый этаж при смене корпуса
  };

  // Обработчик окончания касания
  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    pinchRef.current = null;
    setIsDragging(false);
    setIsLongPressing(false);
  };
    const secondBuildingFloors:{ [key: number]: React.FC<any> } = {
      1: SecondBuildingGroundFloor,
      2: SecondBuildingFirstFloor,
      3: SecondBuildingSecondFloor,
      4: SecondBuildingThirdFloor,
      5: SecondBuildingFourthFloor,
    };


    // Объект для хранения компонентов этажей
    const fifthBuildingFloors: { [key: number]: React.FC<any> } = {
      1: FiveBuildingFirstFloor,
      2: FiveBuildingSecondFloor
      // Добавьте остальные этажи по аналогии
    };

    // Объект для хранения компонентов этажей
    const firstBuildingFloors: { [key: number]: React.FC<any> } = {
      1: FirstBuildingFirstFloor,
      2: FirstBuildingSecondFloor,
      3: FirstBuildingThirdFloor,
      4: FirstBuildingFourthFloor
      // Добавьте остальные этажи по аналогии
    };

    const twelfthBuildingFloors: { [key: number]: React.FC<any> } = {
      1: TwelfthBuildingFirstFloor,
      2: TwelfthBuildingSecondFloor,
      3: TwelfthBuildingThirdFloor
      // Добавьте остальные этажи по аналогии
    };

    const eighthBuildingFloors: { [key: number]: React.FC<any> } = {
      1: EighthBuildingFirstFloor,
      2: EighthBuildingSecondFloor,
      3: EighthBuildingThirdFloor,
      4: EighthBuildingFourthFloor,
      5: EighthBuildingFifthFloor,
      6: EighthBuildingSixthFloor,
      7: EighthBuildingSeventhFloor
      // Добавьте остальные этажи по аналогии
    };

    const buildingMaxFloors = {
      firstBuilding: 4,
      twelfthBuilding: 3,
      eighthBuilding: 7,
      fifthBuilding: 2,
      secondBuilding: 5 
    };

  return (
    <div className="map-container" ref={mapRef}>
      <div className="map-content" onClick={(e) => e.stopPropagation()}>
        <div className="map-placeholder" style={{ width: '2000px', height: '2000px' }}>
        {currentComponent !== 'general' && (
  <>
    <div className="floor-navigation">
      <button 
        onClick={() => setCurrentFloor(prev => Math.min(buildingMaxFloors[currentComponent], prev + 1))}
        disabled={currentFloor === buildingMaxFloors[currentComponent]}
      >
        <FiChevronUp />
      </button>
      <div className="floor-indicator">{currentFloor} этаж</div>
      <button 
        onClick={() => setCurrentFloor(prev => Math.max(1, prev - 1))}
        disabled={currentFloor === 1}
      >
        <FiChevronDown />
      </button>
    </div>

    <button 
  className="back-to-general-button"
  onClick={() => handleBuildingChange('general')}
>
  <div className="button-content">
    <TbMapShare className="general-map-icon" />
    <span className="button-label">на главную</span>
  </div>
</button>
  </>
)}
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
              cursor: isDragging ? 'grabbing' : 'pointer',
              touchAction: 'none',
            }}
          >
          {currentComponent === 'general' ? (
          <GeneralMap onPolygonClick={handleBuildingChange} />
          ) : currentComponent === 'secondBuilding' ? (
          React.createElement(secondBuildingFloors[currentFloor], {
            onBackClick: () => setCurrentComponent('general'),
          })
          ) : currentComponent === 'fifthBuilding' ? (
            React.createElement(fifthBuildingFloors[currentFloor], {
              onBackClick: () => setCurrentComponent('general'),
            })
          ) : currentComponent === 'firstBuilding' ? (
            // Динамически выбираем компонент для отображения этажа
            React.createElement(firstBuildingFloors[currentFloor], {
              onBackClick: () => setCurrentComponent('general'),
            })
          ) : currentComponent === 'twelfthBuilding' ? ( 
            React.createElement(twelfthBuildingFloors[currentFloor], {
              onBackClick: () => setCurrentComponent('general'),
            }) 
          ) : currentComponent === 'eighthBuilding' ? ( 
            React.createElement(eighthBuildingFloors[currentFloor], {
              onBackClick: () => setCurrentComponent('general'),
              onRoomClick: handleRoomClick,
              highlightedRooms: [
                ...(selectedRooms.start ? [selectedRooms.start] : []),
                ...(selectedRooms.end ? [selectedRooms.end] : [])
              ],
              pathPoints: pathPoints
            })
          ) : currentComponent === 'general' ? (
            <GeneralMap onPolygonClick={setCurrentComponent} />
          ) : null
          }
            {marker && (
              <g transform={`translate(${marker.x}, ${marker.y}) scale(${1/scale})`}>
                <foreignObject width="24" height="24" x="-12" y="-24" style={{ pointerEvents: 'none' }}>
                  <FiMapPin 
                    style={{ 
                      color: 'red', 
                      fontSize: '24px',
                      filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'
                    }} 
                  />
                </foreignObject>
              </g>
            )}
        </svg>
        </div>
      </div>
      <div className="zoom-controls">
        <button onClick={zoomIn}><FiPlus /></button>
        <button onClick={resetView}><FiRefreshCw /></button>
        <button onClick={zoomOut}><FiMinus /></button>
      </div>
      {!isMobile && (
        <div className="rotate-controls">
          <button onClick={rotateLeft}><FiRotateCcw /></button>
          <button onClick={rotateRight}><FiRotateCw /></button>
        </div>
      )}

      <div className={`search-container ${isMobile ? 'mobile' : ''}`} style={{ top: '20px' }}>
        <FiSearch className="search-icon" />
        <input
          placeholder="Где вы?"
          value={startQuery}
          onChange={(e) => setStartQuery(e.target.value)}
        />
      </div>
      
      <div className={`search-container ${isMobile ? 'mobile' : ''}`} style={{ top: '80px' }}>
        <FiSearch className="search-icon" />
        <input
          placeholder="Куда вам надо?"
          value={endQuery}
          onChange={(e) => setEndQuery(e.target.value)}
        />
         <button className="search-button">
            Найти
         </button>
      </div>

      {isMobile && (
        <div className="events-panel mobile" ref={eventsPanelRef}>
          <button 
            className="panel-toggle"
            onClick={() => setIsMobileEventsOpen(!isMobileEventsOpen)}
          >
            <FiChevronRight className={`toggle-icon ${isMobileEventsOpen ? 'flipped' : ''}`} />
          </button>
          <div className={`events-list ${isMobileEventsOpen ? 'open' : ''}`}>
            {events.map(event => (
              <div key={event.id} className="event-card-map">
                 <div className="event-time">
                    <span className="start-time">{event.time}</span>
                    <span className="end-time"> {event.endTime}</span>
                  </div>
                <div className="event-map-details">
                  <h4>{event.title}</h4>
                  <div className="event-location">
                    <FiMapPin /> {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isMobile && (
        <div className={`events-panel desktop ${isEventsOpen ? 'open' : ''}`}>
          <button 
            className="panel-toggle"
            onClick={() => setIsEventsOpen(!isEventsOpen)}
          >
            <FiChevronRight className={`toggle-icon ${isEventsOpen ? 'flipped' : ''}`} />
          </button>
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-card-map">
                <div className="event-time">
                  <span className="start-time">{event.time}</span>
                  <span className="end-time"> {event.endTime}</span>
                </div>
                <div className="event-map-details">
                  <h4>{event.title}</h4>
                  <div className="event-location">
                    <FiMapPin /> {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isMobile && marker && (
        <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-content">
            <div className="sidebar-header">
              <FiXCircle 
                className="close-icon"
                onClick={() => {
                  setSidebarOpen(false);
                  setMarker(null);
                }}
              />
              <FiArrowDown
                className="collapse-icon"
                onClick={() => setIsMobilePanelCollapsed(!isMobilePanelCollapsed)}
                style={{ transform: `rotate(${isMobilePanelCollapsed ? 180 : 0}deg)` }}
              />
            </div>

            {route ? (
              <>
                <h3>Маршрут</h3>
                <div className="route-info">
                  <h4 className="section-title">Время в пути</h4>
                  <div className="info-item">
                    <FiClock /> {route.duration}
                  </div>
                  <h4 className="section-title">Адрес</h4>
                  <div className="form-group">
                    <input value={marker.address} readOnly />
                  </div>
                  {!isMobilePanelCollapsed && (
                    <>
                      <h4 className="section-title">Маршрут</h4>
                      <div className="route-steps">
                        {route.steps.map((step, i) => (
                          <div key={i} className="step">
                            <FiChevronsRight /> {step}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button 
                  className="route-button"
                  onClick={() => {
                    setRoute(null);
                    setSidebarOpen(false);
                  }}
                >
                  <FiXCircle /> Завершить маршрут
                </button>
              </>
            ) : (
              <>
                <h3>Данные метки</h3>
                <div className="form-group">
                  <label>Адрес</label>
                  <input value={marker.address} readOnly />
                </div>
                {!isMobilePanelCollapsed && (
                  <>
                    <h4 className="section-title">Фотографии</h4>
                    <div className="photo-carousel">
                      <div className="photo-item add-photo" onClick={handleAddPhoto}>
                        <FiPlus />
                      </div>
                      {marker.photos.map((photo, i) => (
                        <img key={i} src={photo} alt={`Фото ${i+1}`} className="photo-item" />
                      ))}
                    </div>
                    <div className="form-group">
                      <label>Описание</label>
                      <textarea value={marker.description} readOnly />
                    </div>
                  </>
                )}
                <button 
                  className="route-button"
                  onClick={calculateRoute}
                >
                  <FiNavigation /> Проложить маршрут
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {!isMobile && desktopSidebarVisible && (
        <div className={`desktop-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-content">
            <FiX 
              className="close-icon"
              onClick={() => {
                setSidebarOpen(false);
                setMarker(null);
                setRoute(null);
              }}
            />
            
            {route ? (
              <>
                <h3>Маршрут</h3>
                <div className="route-info">
                  <h4 className="section-title">Время в пути</h4>
                  <div className="info-item">
                    <FiClock /> {route.duration}
                  </div>
                  <h4 className="section-title">Адрес</h4>
                  <div className="form-group">
                    <input value={marker?.address || ''} readOnly />
                  </div>
                  <h4 className="section-title">Маршрут</h4>
                  <div className="route-steps">
                    {route.steps.map((step, i) => (
                      <div key={i} className="step">
                        <FiChevronsRight /> {step}
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  className="route-button"
                  onClick={() => {
                    setRoute(null);
                    setSidebarOpen(false);
                  }}
                >
                  <FiXCircle /> Завершить маршрут
                </button>
              </>
            ) : (
              <>
                <h3>Данные метки</h3>
                <div className="form-group">
                  <label>Адрес</label>
                  <input value={marker?.address || ''} readOnly />
                </div>
                {/* <div className='form-group'>
                  <pre>{getMarkerInfo()}</pre>
                </div> */}
                <h4 className="section-title">Фотографии</h4>
                <div className="photo-carousel">
                  <div className="scroll-container">
                    <div className="photo-item add-photo" onClick={handleAddPhoto}>
                      <FiPlus />
                    </div>
                    {marker?.photos.map((photo, i) => (
                      <img key={i} src={photo} alt={`Фото ${i+1}`} className="photo-item" />
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Описание</label>
                  <textarea value={marker?.description || ''} readOnly />
                </div>
                <button 
                  className="route-button"
                  onClick={calculateRoute}
                >
                  <FiMap /> Построить маршрут
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <WeatherWidget />
    </div>
  );
}