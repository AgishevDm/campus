import { GiElevator } from 'react-icons/gi';
import { GiStairs } from 'react-icons/gi';
import { GrRestroomMen } from 'react-icons/gr';
import SvgIcon from './SvgIcon';
interface EighthBuildingSixthFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const EighthBuildingSixthFloor: React.FC<EighthBuildingSixthFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        className={`ladder ${getHighlightClass('ladder-1')}`}
        points="360,100 360,200 400,200 400,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={370} y={140} Icon={ GiStairs } />

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
        stroke-width="2" 
        data-type="elevator"
        data-floor="1"/>
    <SvgIcon x={685} y={90} Icon={ GiElevator } />

    <polygon 
        id="elevator-3" 
        className={`elevator ${getHighlightClass('elevator-3')}`}
        points="1140,100 1140,200 1175,200 1175,100" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="elevator"
        data-floor="1"/>
    <SvgIcon x={1140} y={140} Icon={ GiElevator } />

    <polygon 
        id="mentoilet-1"
        className={`mentoilet ${getHighlightClass('mentoilet-1')}`}
        points="1210,100 1210,200 1245,200 1245,100" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="mentoilet"
        data-floor="1"/>
    <SvgIcon x={1213} y={140} Icon={ GrRestroomMen } />
{[
        { id: "room-1-6", points: "50,50 50,200 240,200 240,50", number: "1", x: 100, y: 100 },
        { id: "room-2-6", points: "50,250 50,340 100,340 100,250", number: "2", x: 60, y: 280 },
        { id: "room-3-6", points: "100,250 100,340 240,340 240,250", number: "3", x: 120, y: 280 },
        { id: "room-4-6", points: "240,250 240,340 280,340 280,250", number: "4", x: 260, y: 280 },
        { id: "room-5-6", points: "280,250 280,340 320,340 320,250", number: "5", x: 300, y: 280 },
        { id: "room-6-6", points: "320,250 320,340 400,340 400,250", number: "6", x: 360, y: 280 },
        { id: "room-7-6", points: "400,250 400,340 480,340 480,250", number: "7", x: 440, y: 300 },
        { id: "room-8-6", points: "480,200 480,300 600,300 600,200", number: "8", x: 520, y: 250 },
        { id: "room-9-6", points: "600,200 600,300 650,300 650,200", number: "9", x: 620, y: 250 },
        { id: "room-10-6", points: "650,200 650,300 780,300 780,200", number: "10", x: 700, y: 250 },
        { id: "room-11-6", points: "780,200 780,300 900,300 900,200", number: "11", x: 820, y: 250 },
        { id: "room-12-6", points: "900,200 900,300 940,300 940,200", number: "12", x: 920, y: 250 },
        { id: "room-13-6", points: "940,200 940,300 1060,300 1060,200", number: "13", x: 1000, y: 250 },
        { id: "room-14-6", points: "1020,200 1020,300 1100,300 1100,200", number: "14", x: 1080, y: 250 },
        { id: "room-15-6", points: "1100,250 1100,340 1140,340 1140,250", number: "15", x: 1120, y: 300 },
        { id: "room-16-6", points: "1140,250 1140,340 1210,340 1210,250", number: "16", x: 1180, y: 300 },
        { id: "room-17-6", points: "1210,280 1210,340 1250,340 1250,280", number: "17", x: 1230, y: 300 },
        { id: "room-0-6", points: "1210,250 1210,280 1250,280 1250,250", number: "0", x: 0, y: 0 },
        { id: "room-18-6", points: "1250,280 1250,340 1290,340 1290,280", number: "18", x: 1270, y: 300 },
        { id: "room-19-6", points: "1250,250 1250,280 1290,280 1290,250", number: "0", x: 0, y: 0 },
        { id: "room-20-6", points: "1290,250 1290,340 1330,340 1330,250", number: "20", x: 1310, y: 270 },
        { id: "room-21-6", points: "1330,250 1330,340 1370,340 1370,250", number: "21", x: 1350, y: 270 },
        { id: "room-22-6", points: "1370,250 1370,340 1490,340 1490,250", number: "22", x: 1400, y: 270 },
        { id: "room-23-6", points: "240,100 240,200 280,200 280,100", number: "23", x: 260, y: 130 },
        { id: "room-24-6", points: "280,100 280,200 320,200 320,100", number: "24", x: 300, y: 130 },
        { id: "room-25-6", points: "320,100 320,200 360,200 360,100", number: "25", x: 340, y: 130 },
        { id: "room-26-6", points: "480,50 480,150 600,150 600,50", number: "26", x: 500, y: 130 },
        { id: "room-27-6", points: "600,50 600,150 640,150 640,50", number: "27", x: 620, y: 130 },
        { id: "room-28-6", points: "640,50 640,150 680,150 680,50", number: "28", x: 660, y: 130 },
        { id: "room-29-6", points: "920,50 920,150 960,150 960,50", number: "29", x: 940, y: 130 },
        { id: "room-30-6", points: "960,50 960,150 1000,150 1000,50", number: "30", x: 980, y: 130 },
        { id: "room-31-6", points: "1000,50 1000,150 1100,150 1100,50", number: "31", x: 1080, y: 130 },
        { id: "room-32-6", points: "1245,100 1245,200 1285,200 1285,100", number: "32", x: 1260, y: 130 },
        { id: "room-33-6", points: "1285,100 1285,200 1320,200 1320,100", number: "33", x: 1300, y: 130 },
        { id: "room-34-6", points: "1320,50 1320,200 1400,200 1400,50", number: "34", x: 1360, y: 130 },
        { id: "room-35-6", points: "1400,50 1400,200 1490,200 1490,50", number: "35", x: 1420, y: 130 },

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
        { id: "door-1-6", points: "70,200 90,200" },
        { id: "door-2-6", points: "200,200 220,200" },
        { id: "door-3-6", points: "65,250 85,250" },
        { id: "door-4-6", points: "100,260 100,280" },
        { id: "door-5-6", points: "195,250 210,250" },
        { id: "door-6-6", points: "250,250 270,250" },
        { id: "door-7-6", points: "290,250 310,250" },
        { id: "door-8-6", points: "340,250 360,250" },
        { id: "door-9-6", points: "320,260 320,270" },
        { id: "door-10-6", points: "440,250 460,250" },
        { id: "door-11-6", points: "530,200 550,200" },
        { id: "door-12-6", points: "610,200 630,200" },
        { id: "door-13-6", points: "670,200 690,200" },
        { id: "door-14-6", points: "800,200 820,200" },
        { id: "door-15-6", points: "910,200 930,200" },
        { id: "door-16-6", points: "980,200 1000,200" },
        { id: "door-17-6", points: "1070,200 1090,200" },
        { id: "door-18-6", points: "1110,250 1130,250" },
        { id: "door-19-6", points: "1150,250 1170,250" },
        { id: "door-20-6", points: "1210,290 1210,300" },
        { id: "door-21-6", points: "1225,250 1240,250" },
        { id: "door-22-6", points: "1225,280 1240,280" },
        { id: "door-23-6", points: "1260,280 1270,280" },
        { id: "door-24-6", points: "1250,290 1250,300" },
        { id: "door-25-6", points: "1290,250 1300,250" },
        { id: "door-26-6", points: "1340,250 1350,250" },
        { id: "door-27-6", points: "1420,250 1440,250" },
        { id: "door-28-6", points: "250,200 270,200" },
        { id: "door-29-6", points: "290,200 310,200" },
        { id: "door-30-6", points: "330,200 340,200" },
        { id: "door-31-6", points: "370,200 390,200" },
        { id: "door-32-6", points: "530,150 550,150" },
        { id: "door-33-6", points: "610,150 630,150" },
        { id: "door-34-6", points: "650,150 670,150" },
        { id: "door-34-6", points: "650,150 670,150" },
        { id: "door-35-6", points: "940,150 950,150" },
        { id: "door-36-6", points: "970,150 985,150" },
        { id: "door-37-6", points: "1060,150 1080,150" },
        { id: "door-38-6", points: "1255,200 1275,200" },
        { id: "door-39-6", points: "1295,200 1310,200" },
        { id: "door-40-6", points: "1370,200 1390,200" },
        { id: "door-41-6", points: "1430,200 1450,200" },


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