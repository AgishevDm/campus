import { GiElevator } from 'react-icons/gi';
import { GiStairs } from 'react-icons/gi';
import { GrRestroomWomen } from 'react-icons/gr';
import SvgIcon from './SvgIcon';


interface EighthBuildingFifthFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const EighthBuildingFifthFloor: React.FC<EighthBuildingFifthFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        data-floor="1" />
    <text x="100" y="220" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>

    <polygon 
        id="ladder-1"
        className={`dining ${getHighlightClass('ladder-1')}`}
        points="360,100 360,200 400,200 400,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={370} y={140} Icon={ GiStairs } />

    <polygon 
        id="ladder-2"
        className={`dining ${getHighlightClass('ladder-2')}`}
        points="820,50 820,150 920,150 920,50" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={880} y={90} Icon={ GiStairs } />

    <polygon 
        id="ladder-3"
        className={`dining ${getHighlightClass('ladder-3')}`}
        points="1175,100 1175,200 1210,200 1210,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={1180} y={140} Icon={ GiStairs } />

    <polygon 
        id="elevator-1" 
        className={`dining ${getHighlightClass('elevator-1')}`}
        points="400,100 400,200 440,200 440,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="elevator"
        data-floor="1"/>
    <SvgIcon x={405} y={140} Icon={ GiElevator } />

    <polygon 
        id="elevator-2" 
        className={`dining ${getHighlightClass('elevator-2')}`}
        points="680,50 680,150 720,150 720,50" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="elevator"
        data-floor="1" />
    <SvgIcon x={685} y={90} Icon={ GiElevator } />

    <polygon
        id="elevator-3" 
        className={`dining ${getHighlightClass('elevator-3')}`}
        points="1140,100 1140,200 1175,200 1175,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="elevator"
        data-floor="1" />
    <SvgIcon x={1140} y={140} Icon={ GiElevator } />

    <polygon 
        id="mentoilet-1"
        className={`dining ${getHighlightClass('mentoilet-1')}`}
        points="1210,100 1210,200 1245,200 1245,100" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="mentoilet"
        data-floor="1" />
    <SvgIcon x={1213} y={140} Icon={ GrRestroomWomen } />
    
{[
        { id: "room-1-5", points: "50,50 50,200 240,200 240,50", number: "1", x: 100, y: 100 },
        { id: "room-2-5", points: "50,250 50,340 100,340 100,250", number: "2", x: 60, y: 280 },
        { id: "room-3-5", points: "100,250 100,340 185,340 185,250", number: "3", x: 120, y: 280 },
        { id: "room-4-5", points: "185,250 185,340 225,340 225,250", number: "4", x: 200, y: 280 },
        { id: "room-5-5", points: "225,250 225,340 260,340 260,250", number: "5", x: 240, y: 280 },
        { id: "room-6-5", points: "260,250 260,340 385,340 385,250", number: "6", x: 320, y: 280 },
        { id: "room-7-5", points: "385,250 385,340 480,340 480,250", number: "7", x: 400, y: 280 },
        { id: "room-8-5", points: "480,200 480,300 520,300 520,200", number: "8", x: 500, y: 250 },
        { id: "room-9-5", points: "520,200 520,300 720,300 720,200", number: "9", x: 540, y: 250 },
        { id: "room-10-5", points: "720,200 720,300 780,300 780,200", number: "10", x: 740, y: 250 },
        { id: "room-11-5", points: "780,200 780,300 920,300 920,200", number: "11", x: 590, y: 250 },
        { id: "room-12-5", points: "920,200 920,300 1060,300 1060,200", number: "12", x: 940, y: 250 },
        { id: "room-13-5", points: "1060,200 1060,300 1100,300 1100,200", number: "13", x: 1080, y: 250 },
        { id: "room-14-5", points: "1100,250 1100,340 1140,340 1140,250", number: "14", x: 1120, y: 300 },
        { id: "room-15-5", points: "1140,250 1140,340 1180,340 1180,250", number: "15", x: 1160, y: 300 },
        { id: "room-16-5", points: "1180,250 1180,340 1330,340 1330,250", number: "16", x: 1250, y: 300 },
        { id: "room-17-5", points: "1180,250 1180,340 1210,340 1210,280", number: "0", x: 0, y: 0 },
        { id: "room-18-5", points: "1330,250 1330,340 1370,340 1370,250", number: "18", x: 1350, y: 270 },
        { id: "room-19-5", points: "1370,250 1370,340 1490,340 1490,250", number: "19", x: 1400, y: 270 },
        { id: "room-20-5", points: "240,100 240,200 280,200 280,100", number: "20", x: 260, y: 130 },
        { id: "room-21-5", points: "280,100 280,200 320,200 320,100", number: "21", x: 300, y: 130 },
        { id: "room-22-5", points: "320,100 320,200 360,200 360,100", number: "22", x: 340, y: 130 },
        { id: "room-23-5", points: "480,50 480,150 520,150 520,50", number: "23", x: 500, y: 130 },
        { id: "room-24-5", points: "520,50 520,150 560,150 560,50", number: "24", x: 540, y: 130 },
        { id: "room-25-5", points: "560,50 560,150 640,150 640,50", number: "25", x: 580, y: 130 },
        { id: "room-26-5", points: "640,50 640,150 680,150 680,50", number: "26", x: 660, y: 130 },
        { id: "room-27-5", points: "920,50 920,150 960,150 960,50", number: "27", x: 940, y: 130 },
        { id: "room-28-5", points: "960,50 960,150 1100,150 1100,50", number: "28", x: 1080, y: 130 },
        { id: "room-29-5", points: "1245,100 1245,200 1285,200 1285,100", number: "29", x: 1260, y: 130 },
        { id: "room-30-5", points: "1285,100 1285,200 1320,200 1320,100", number: "30", x: 1300, y: 130 },
        { id: "room-31-5", points: "1320,50 1320,200 1400,200 1400,50", number: "31", x: 1360, y: 130 },
        { id: "room-32-5", points: "1400,50 1400,200 1490,200 1490,50", number: "32", x: 1420, y: 130 },

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
        { id: "door-1-5", points: "70,200 90,200" },
        { id: "door-2-5", points: "200,200 220,200" },
        { id: "door-3-5", points: "70,250 90,250" },
        { id: "door-4-5", points: "110,250 130,250" },
        { id: "door-5-5", points: "195,250 210,250" },
        { id: "door-6-5", points: "235,250 250,250" },
        { id: "door-7-5", points: "340,250 360,250" },
        { id: "door-8-5", points: "400,250 420,250" },
        { id: "door-9-5", points: "495,200 505,200" },
        { id: "door-10-5", points: "540,200 560,200" },
        { id: "door-11-5", points: "740,200 760,200" },
        { id: "door-12-5", points: "885,200 900,200" },
        { id: "door-13-5", points: "950,200 970,200" },
        { id: "door-14-5", points: "1070,200 1090,200" },
        { id: "door-15-5", points: "1110,250 1130,250" },
        { id: "door-16-5", points: "1150,250 1170,250" },
        { id: "door-17-5", points: "1180,260 1180,270" },
        { id: "door-18-5", points: "1200,250 1220,250" },
        { id: "door-19-5", points: "1340,250 1350,250" },
        { id: "door-20-5", points: "1380,250 1390,250" },
        { id: "door-21-5", points: "1330,300 1330,320" },
        { id: "door-22-5", points: "250,200 270,200" },
        { id: "door-23-5", points: "290,200 310,200" },
        { id: "door-24-5", points: "330,200 340,200" },
        { id: "door-25-5", points: "370,200 390,200" },
        { id: "door-26-5", points: "530,150 540,150" },
        { id: "door-27-5", points: "520,130 520,140" },
        { id: "door-28-5", points: "610,150 630,150" },
        { id: "door-29-5", points: "650,150 670,150" },
        { id: "door-30-5", points: "940,150 950,150" },
        { id: "door-31-5", points: "980,150 1000,150" },
        { id: "door-32-5", points: "1060,150 1080,150" },
        { id: "door-33-5", points: "1255,200 1275,200" },
        { id: "door-34-5", points: "1295,200 1310,200" },
        { id: "door-35-5", points: "1370,200 1390,200" },
        { id: "door-36-5", points: "1430,180 1430,160" },

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