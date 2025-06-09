import { GiElevator } from 'react-icons/gi';
import { GiStairs } from 'react-icons/gi';
import { GrRestroomWomen } from 'react-icons/gr';
import SvgIcon from './SvgIcon';


interface EighthBuildingSecondFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const EighthBuildingSecondFloor: React.FC<EighthBuildingSecondFloorProops> = ({ onBackClick, onRoomClick = () => {},
  highlightedRooms = [],
  routePath 
}) => {
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
      const target = e.target as SVGGraphicsElement;
      if (target instanceof SVGPolygonElement && target.id) {
        const roomType = target.dataset.type || 'room';
        onRoomClick(target.id, roomType);
      }
    };

    const getHighlightClass = (id: string) => 
        highlightedRooms.includes(id) ? 'highlighted' : '';

    return(
        <svg onClick={handleSvgClick}>
        <rect width="100%" height="100%" fill="#f0f0f0" />

    <polygon
        id="corridor-1"
        className={`corridor ${getHighlightClass('corridor-1')}`}
        points="50,150 50,200 300,200 300,250 480,250 480,200 
        1100,200 1100,250 1490,250 1530,225 1490,200 1150,200 
        1150,100 1100,100 1100,150 820,150 820,50 720,50 720,150 480,150 
        480,100 440,100 440,200 360,200 360,150" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        strokeWidth="1"
        data-type="corridor"
        data-floor="1" />
    <text x="100" y="180" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>

    <polygon 
        id="ladder-1"
        className={`ladder ${getHighlightClass('ladder-1')}`}
        points="360,100 360,200 400,200 400,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={370} y={140} Icon={ GiStairs } />

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`}
        points="820,50 820,150 920,150 920,50" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={880} y={90} Icon={ GiStairs } />

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`}
        points="1175,100 1175,200 1210,200 1210,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={1180} y={140} Icon={ GiStairs } />

    <polygon 
        id="elevator-1" 
        className={`elevator ${getHighlightClass('elevator-1')}`}
        points="400,100 400,200 440,200 440,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="elevator"
        data-floor="1"/>
    <SvgIcon x={405} y={140} Icon={ GiElevator } />

    <polygon 
        id="elevator-2" 
        className={`elevator ${getHighlightClass('elevator-2')}`}
        points="680,50 680,150 720,150 720,50" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="elevator"
        data-floor="1"/>
    <SvgIcon x={685} y={90} Icon={ GiElevator } />

    <polygon 
        id="elevator-3" 
        className={`elevator ${getHighlightClass('elevator-3')}`}
        points="1140,100 1140,200 1175,200 1175,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="elevator"
        data-floor="1" />
    <SvgIcon x={1140} y={140} Icon={ GiElevator } />

    <polygon 
        id="mentoilet-1"
        className={`mentoilet ${getHighlightClass('mentoilet-1')}`}
        points="1210,100 1210,200 1245,200 1245,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" />
    <SvgIcon x={1213} y={140} Icon={ GrRestroomWomen } />
{[
        { id: "room-1-2", points: "50,50 50,150 150,150 150,50", number: "1", x: 100, y: 100 },
        { id: "room-2-2", points: "50,200 50,340 300,340 300,200", number: "2", x: 180, y: 280 },
        { id: "room-3-2", points: "300,250 300,340 345,340 345,250", number: "3", x: 320, y: 280 },
        { id: "room-4-2", points: "345,250 345,340 390,340 390,250", number: "4", x: 365, y: 280 },
        { id: "room-5-2", points: "390,250 390,340 435,340 435,250", number: "5", x: 410, y: 280 },
        { id: "room-6-2", points: "435,250 435,340 480,340 480,250", number: "6", x: 455, y: 280 },
        { id: "room-7-2", points: "480,200 480,300 640,300 640,200", number: "7", x: 500, y: 250 },
        { id: "room-8-2", points: "640,200 640,300 780,300 780,200", number: "8", x: 680, y: 250 },
        { id: "room-9-2", points: "780,200 780,300 870,300 870,200", number: "9", x: 820, y: 250 },
        { id: "room-10-2", points: "870,200 870,300 980,300 980,200", number: "10", x: 900, y: 250 },
        { id: "room-11-2", points: "980,200 980,300 1020,300 1020,200", number: "11", x: 1000, y: 250 },
        { id: "room-12-2", points: "1020,200 1020,300 1060,300 1060,200", number: "12", x: 1040, y: 250 },
        { id: "room-13-2", points: "1060,200 1060,300 1100,300 1100,200", number: "13", x: 1080, y: 250 },
        { id: "room-14-2", points: "1100,250 1100,340 1190,340 1190,250", number: "14", x: 1150, y: 300 },
        { id: "room-15-2", points: "1180,250 1180,340 1215,340 1215,250", number: "15", x: 1200, y: 300 },
        { id: "room-16-2", points: "1215,250 1215,340 1250,340 1250,250", number: "16", x: 1235, y: 300 },
        { id: "room-17-2", points: "1250,250 1250,340 1285,340 1285,250", number: "17", x: 1270, y: 300 },
        { id: "room-18-2", points: "1285,250 1285,340 1320,340 1320,250", number: "18", x: 1300, y: 300 },
        { id: "room-19-2", points: "1320,250 1320,340 1405,340 1405,250", number: "19", x: 1380, y: 300 },
        { id: "room-20-2", points: "1405,250 1405,340 1490,340 1490,250", number: "20", x: 1450, y: 300 },
        { id: "room-21-2", points: "150,50 150,150 195,150 195,50", number: "21", x: 180, y: 100 },
        { id: "room-22-2", points: "195,50 195,150 240,150 240,50", number: "22", x: 215, y: 100 },
        { id: "room-23-2", points: "240,100 240,150 280,150 280,100", number: "23", x: 260, y: 130 },
        { id: "room-24-2", points: "280,100 280,150 320,150 320,100", number: "24", x: 300, y: 130 },
        { id: "room-25-2", points: "320,100 320,150 360,150 360,100", number: "25", x: 340, y: 130 },
        { id: "room-26-2", points: "480,50 480,150 520,150 520,50", number: "26", x: 500, y: 130 },
        { id: "room-27-2", points: "520,50 520,150 560,150 560,50", number: "27", x: 540, y: 130 },
        { id: "room-28-2", points: "560,50 560,150 600,150 600,50", number: "28", x: 580, y: 130 },
        { id: "room-29-2", points: "600,50 600,150 640,150 640,50", number: "29", x: 620, y: 130 },
        { id: "room-30-2", points: "640,50 640,150 680,150 680,50", number: "30", x: 660, y: 130 },
        { id: "room-31-2", points: "920,50 920,150 1100,150 1100,50", number: "31", x: 1000, y: 130 },
        { id: "room-32-2", points: "1245,100 1245,200 1285,200 1285,100", number: "32", x: 1260, y: 130 },
        { id: "room-33-2", points: "1285,100 1285,200 1320,200 1320,100", number: "33", x: 1300, y: 130 },
        { id: "room-34-2", points: "1320,50 1320,200 1405,200 1405,50", number: "34", x: 1360, y: 130 },
        { id: "room-35-2", points: "1405,50 1405,200 1490,200 1490,50", number: "35", x: 1440, y: 130 },

    ].map(room => (
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
            data-associated-with={room.id}
            >
            {room.number}
            </text>
        </g>
    ))}

{[
        { id: "door-1-2", points: "130,150 110,150" },
        { id: "door-2-2", points: "80,200 100,200" },
        { id: "door-3-2", points: "240,200 260,200" },
        { id: "door-4-2", points: "310,250 330,250" },
        { id: "door-5-2", points: "360,250 380,250" },
        { id: "door-6-2", points: "400,250 420,250" },
        { id: "door-7-2", points: "445,250 465,250" },
        { id: "door-8-2", points: "600,200 620,200" },
        { id: "door-9-2", points: "500,200 520,200" },
        { id: "door-10-2", points: "700,200 720,200" },
        { id: "door-11-2", points: "790,200 810,200" },
        { id: "door-12-2", points: "840,200 860,200" },
        { id: "door-13-2", points: "900,200 920,200" },
        { id: "door-14-2", points: "990,200 1010,200" },
        { id: "door-15-2", points: "1030,200 1050,200" },
        { id: "door-16-2", points: "1070,200 1090,200" },
        { id: "door-17-2", points: "1130,250 1150,250" },
        { id: "door-18-2", points: "1185,250 1205,250" },
        { id: "door-19-2", points: "1220,250 1240,250" },
        { id: "door-20-2", points: "1260,250 1275,250" },
        { id: "door-21-2", points: "1295,250 1310,250" },
        { id: "door-22-2", points: "1350,250 1370,250" },
        { id: "door-23-2", points: "1420,250 1440,250" },
        { id: "door-24-2", points: "160,150 180,150" },
        { id: "door-25-2", points: "195,100 195,120" },
        { id: "door-26-2", points: "250,150 270,150" },
        { id: "door-27-2", points: "290,150 310,150" },
        { id: "door-28-2", points: "330,150 340,150" },
        { id: "door-29-2", points: "370,200 390,200" },
        { id: "door-30-2", points: "490,150 510,150" },
        { id: "door-31-2", points: "530,150 550,150" },
        { id: "door-32-2", points: "570,150 590,150" },
        { id: "door-33-2", points: "610,150 630,150" },
        { id: "door-34-2", points: "650,150 670,150" },
        { id: "door-35-2", points: "940,150 960,150" },
        { id: "door-36-2", points: "1040,150 1060,150" },
        { id: "door-37-2", points: "1255,200 1275,200" },
        { id: "door-38-2", points: "1295,200 1310,200" },
        { id: "door-39-2", points: "1370,200 1390,200" },
        { id: "door-40-2", points: "1420,200 1440,200" },

    ].map(door => (
        <g key={door.id}>
            <polygon
            id={door.id}
            className={`door ${getHighlightClass(door.id)}`}
            points={door.points}
            fill="#999999"
            stroke="#f9f9ff"
            strokeWidth="4"
            data-type="classdoor"
            data-floor="1"
            />
        </g>
    ))}

    <polygon
        points="50,50 50,340 480,340 480,300 1100,300 1100,340 
        1490,340 1490,250 1530,225 1490,200 1490,50 1320,50 1320,100 1100,100 1100,50 480,50 480,100 
        240,100 240,50" 
        fill="none" stroke="black" stroke-width="4" />
        
        </svg>
    );
};