export interface RoomData {
    id: string;
    points: string;
    number?: string;
    x?: number;
    y?: number;
    entrance?: { x: number; y: number };
    neighbors?: string[];
    pathPoints?: { x: number; y: number }[];
    dataType?: string;
}

export const roomsData: RoomData[] = [
    {
      id: "room-1-1",
      points: "200,100 200,200 240,200 240,100",
      number: "1",
      x: 220, y: 150,
      entrance: { x: 220, y: 200 },
      neighbors: ["corridor-1"]
    },
    {
      id: "room-2-1",
      points: "240,100 240,200 280,200 280,100",
      number: "2",
      x: 260, y: 150,
      entrance: { x: 260, y: 200 },
      neighbors: ["corridor-1"]
    },
    {
      id: "corridor-1",
      points: "50,200 50,250 480,250 480,200 720,200 720,260 760,260 760,300 820,300 820,260 860,260 860,200 1100,200 1100,250 1490,250 1490,200 1150,200 1150,100 1100,100 1100,150 880,150 880,120 820,120 820,80 880,80 880,50 720,50 720,150 480,150 480,100 440,100 440,200", // полные координаты
      entrance: { x: 265, y: 200 },
      neighbors: ["room-1-1", "room-2-1", "ladder-1"],
      pathPoints: [
        { x: 265, y: 225 },  // Вход из комнаты 1
        { x: 480, y: 225 },  // Первый прямой участок
        { x: 720, y: 225 },  // Центральная часть
        { x: 760, y: 260 },  // Поворот направо (координаты Y увеличены)
        { x: 820, y: 260 },  // Обратный поворот
        { x: 860, y: 225 },  // Возврат на основную линию
        { x: 1100, y: 225 }, // Правый участок
        { x: 1300, y: 225 }  // Конец коридора
      ],
      dataType: "corridor"
    },
    {
      id: "ladder-1",
      points: "360,100 360,200 400,200 400,100",
      entrance: { x: 380, y: 150 },
      neighbors: ["corridor-1"]
    }
  ];