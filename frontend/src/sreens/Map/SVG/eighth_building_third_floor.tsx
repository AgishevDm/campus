import { GiElevator } from 'react-icons/gi';
import { GiStairs } from 'react-icons/gi';
import { GrRestroomWomen } from 'react-icons/gr';
import SvgIcon from './SvgIcon';

interface EighthBuildingThirdFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const EighthBuildingThirdFloor: React.FC<EighthBuildingThirdFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="50,200 50,250 300,250 300,250 480,250 480,200 
        1100,200 1100,250 1490,250 1530,225 1490,200 1150,200 
        1150,100 1100,100 1100,150 820,150 820,50 720,50 720,150 480,150 
        480,100 440,100 440,200 360,200 " 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        strokeWidth="1"
        data-type="corridor"
        data-floor="1" 
        />
    <text x="100" y="220" font-family="'Roboto', sans-serif"
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
        data-floor="1"/>
    <SvgIcon x={370} y={140} Icon={ GiStairs } />

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
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`}
        points="820,50 820,150 920,150 920,50" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={880} y={90} Icon={ GiStairs } />

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
        id="mentoilet-1"
        className={`mentoilet ${getHighlightClass('mentoilet-1')}`}
        points="1210,100 1210,200 1245,200 1245,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="mentoilet"
        data-floor="1"/>
    <SvgIcon x={1213} y={140} Icon={ GrRestroomWomen } />
{[
        { id: "room-1-3", points: "50,50 50,200 150,200 150,50", number: "1", x: 100, y: 100 },
        { id: "room-2-3", points: "50,250 50,340 110,340 110,250", number: "2", x: 60, y: 280 },
        { id: "room-3-3", points: "110,250 110,340 160,340 160,250", number: "3", x: 120, y: 280 },
        { id: "room-4-3", points: "160,250 160,340 260,340 260,250", number: "4", x: 180, y: 280 },
        { id: "room-5-3", points: "260,250 260,340 305,340 305,250", number: "5", x: 280, y: 280 },
        { id: "room-6-3", points: "305,250 305,340 340,340 340,250", number: "6", x: 320, y: 280 },
        { id: "room-7-3", points: "340,250 340,340 385,340 385,250", number: "7", x: 360, y: 280 },
        { id: "room-8-3", points: "385,250 385,340 480,340 480,250", number: "8", x: 400, y: 280 },
        { id: "room-9-3", points: "480,200 480,300 520,300 520,200", number: "9", x: 500, y: 250 },
        { id: "room-10-3", points: "520,200 520,300 560,300 560,200", number: "10", x: 540, y: 250 },
        { id: "room-11-3", points: "560,200 560,300 660,300 660,200", number: "11", x: 660, y: 250 },
        { id: "room-12-3", points: "660,200 660,300 770,300 770,200", number: "12", x: 700, y: 250 },
        { id: "room-13-3", points: "770,200 770,300 820,300 820,200", number: "13", x: 800, y: 250 },
        { id: "room-14-3", points: "820,200 820,300 870,300 870,200", number: "14", x: 840, y: 250 },
        { id: "room-15-3", points: "870,200 870,300 920,300 920,200", number: "15", x: 890, y: 250 },
        { id: "room-16-3", points: "920,200 920,300 1060,300 1060,200", number: "16", x: 980, y: 250 },
        { id: "room-17-3", points: "1060,230 1060,300 1100,300 1100,230", number: "17", x: 1070, y: 250 },
        { id: "room-18-3", points: "1100,250 1100,340 1140,340 1140,250", number: "18", x: 1120, y: 300 },
        { id: "room-19-3", points: "1140,250 1140,340 1320,340 1320,250", number: "19", x: 1200, y: 300 },
        { id: "room-20-3", points: "1285,250 1285,340 1320,340 1320,250", number: "20", x: 1300, y: 300 },
        { id: "room-21-3", points: "1320,250 1320,340 1355,340 1355,250", number: "21", x: 1340, y: 300 },
        { id: "room-22-3", points: "1355,280 1355,340 1390,340 1390,280", number: "22", x: 1370, y: 300 },
        { id: "room-23-3", points: "1355,250 1355,280 1390,280 1390,250", number: "23", x: 1370, y: 260 },
        { id: "room-24-3", points: "1390,250 1390,340 1435,340 1435,250", number: "24", x: 1410, y: 300 },
        { id: "room-25-3", points: "1435,250 1435,340 1490,340 1490,250", number: "25", x: 1450, y: 300 },
        { id: "room-26-3", points: "150,50 150,200 240,200 240,50", number: "26", x: 180, y: 100 },
        { id: "room-27-3", points: "240,100 240,200 280,200 280,100", number: "27", x: 260, y: 130 },
        { id: "room-28-3", points: "280,100 280,200 320,200 320,100" , number: "28", x: 300, y: 130 },
        { id: "room-29-3", points: "320,100 320,200 360,200 360,100" , number: "29", x: 340, y: 130 },
        { id: "room-30-3", points: "480,50 480,150 520,150 520,50" , number: "30", x: 500, y: 130 },
        { id: "room-31-3", points: "520,50 520,150 560,150 560,50" , number: "31", x: 540, y: 130 },
        { id: "room-32-3", points: "560,50 560,150 640,150 640,50" , number: "32", x: 580, y: 130 },
        { id: "room-33-3", points: "640,50 640,150 680,150 680,50" , number: "33", x: 660, y: 130 },
        { id: "room-34-3", points: "920,50 920,150 1060,150 1060,50" , number: "34", x: 1000, y: 130 },
        { id: "room-35-3", points: "1060,50 1060,150 1100,150 1100,50" , number: "35", x: 1080, y: 130 },
        { id: "room-36-3", points: "1245,100 1245,200 1285,200 1285,100" , number: "36", x: 1260, y: 130 },
        { id: "room-37-3", points: "1285,100 1285,200 1320,200 1320,100" , number: "37", x: 1300, y: 130 },
        { id: "room-38-3", points: "1320,50 1320,200 1405,200 1405,50" , number: "38", x: 1360, y: 130 },
        { id: "room-39-3", points: "1405,50 1405,200 1490,200 1490,50" , number: "39", x: 1440, y: 130 },
        { id: "room-40-3", points: "1060,200 1060,230 1100,230 1100,200" , number: "0", x: 0, y: 0 },
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
        { id: "door-1-3", points: "130,200 110,200" },
        { id: "door-2-3", points: "70,250 90,250" },
        { id: "door-3-3", points: "125,250 145,250" },
        { id: "door-4-3", points: "180,250 200,250" },
        { id: "door-5-3", points: "275,250 285,250" },
        { id: "door-6-3", points: "315,250 325,250" },
        { id: "door-7-3", points: "350,250 370,250" },
        { id: "door-8-3", points: "400,250 420,250" },
        { id: "door-9-3", points: "495,200 505,200" },
        { id: "door-10-3", points: "535,200 545,200" },
        { id: "door-11-3", points: "590,200 610,200" },
        { id: "door-12-3", points: "700,200 720,200" },
        { id: "door-13-3", points: "780,200 800,200" },
        { id: "door-14-3", points: "835,200 850,200" },
        { id: "door-15-3", points: "885,200 900,200" },
        { id: "door-16-3", points: "920,210 920,230" },
        { id: "door-17-3", points: "1060,270 1060,290" },
        { id: "door-18-3", points: "1070,230 1090,230" },
        { id: "door-19-3", points: "1140,260 1140,280" },
        { id: "door-20-3", points: "1160,250 1180,250" },
        { id: "door-21-3", points: "1295,250 1310,250" },
        { id: "door-22-3", points: "1360,250 1380,250" },
        { id: "door-23-3", points: "1355,260 1355,270" },
        { id: "door-24-3", points: "1420,250 1440,250" },
        { id: "door-25-3", points: "1390,260 1390,270" },
        { id: "door-26-3", points: "1435,315 1435,330" },
        { id: "door-27-3", points: "200,200 220,200" },
        { id: "door-28-3", points: "250,200 270,200" },
        { id: "door-29-3", points: "290,200 310,200" },
        { id: "door-30-3", points: "330,200 340,200" },
        { id: "door-31-3", points: "370,200 390,200" },
        { id: "door-32-3", points: "490,150 510,150" },
        { id: "door-33-3", points: "530,150 550,150" },
        { id: "door-34-3", points: "610,150 630,150" },
        { id: "door-35-3", points: "650,150 670,150" },
        { id: "door-35-3", points: "940,150 960,150" },
        { id: "door-36-3", points: "1040,150 1060,150" },
        { id: "door-37-3", points: "1255,200 1275,200" },
        { id: "door-38-3", points: "1295,200 1310,200" },
        { id: "door-39-3", points: "1370,200 1390,200" },
        { id: "door-40-3", points: "1420,200 1440,200"  },

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