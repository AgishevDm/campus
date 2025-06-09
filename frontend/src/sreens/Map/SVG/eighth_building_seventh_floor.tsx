import { GiElevator } from 'react-icons/gi';
import { GiStairs } from 'react-icons/gi';
import { GrRestroomMen } from 'react-icons/gr';
import SvgIcon from './SvgIcon';
interface EighthBuildingSeventhFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const EighthBuildingSeventhFloor: React.FC<EighthBuildingSeventhFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        strokeWidth="2" 
        data-type="corridor"
        data-floor="1"/>
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
        data-floor="1"/>
    <SvgIcon x={1140} y={140} Icon={ GiElevator } />

    <polygon 
        id="mentoilet-1"
        className={`mentoilet ${getHighlightClass('mentoilet-1')}`}
        points="1210,100 1210,200 1245,200 1245,100" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2" 
        data-type="mentoilet"
        data-floor="1"/> 
    <SvgIcon x={1213} y={140} Icon={ GrRestroomMen } />
{[
        { id: "room-9-7", points: "50,50 50,200 110,200 110,50", number: "9", x: 70, y: 100 },
        { id: "room-10-7", points: "110,50 110,200 320,200 320,100 240,100 240,50", number: "10", x: 250, y: 140 },
        { id: "room-0-7", points: "110,120 110,200 160,200 160,120", number: "0", x: 0, y: 0 },
        { id: "room-0-0-7", points: "120,80 120,120 160,120 160,80", number: "0", x: 0, y: 0 },
        { id: "room-1-7", points: "50,250 50,340 220,340 220,250", number: "1", x: 60, y: 280 },
        { id: "room-2-7", points: "220,250 220,340 380,340 380,250", number: "2", x: 260, y: 280 },
        { id: "room-3-7", points: "380,250 380,340 430,340 430,250", number: "3", x: 400, y: 300 },
        { id: "room-4-7", points: "430,250 430,340 480,340 480,250", number: "4", x: 450, y: 300 },
        { id: "room-5-7", points: "480,200 480,300 720,300 720,200", number: "5", x: 520, y: 250 },
        { id: "room-6-7", points: "720,200 720,300 1020,300 1020,200", number: "6", x: 820, y: 250 },
        { id: "room-7-7", points: "1020,200 1020,300 1100,300 1100,200", number: "7", x: 1080, y: 250 },
        { id: "room-8-7", points: "1100,250 1100,340 1490,340 1490,250", number: "8", x: 1120, y: 300 },
        { id: "room-11-7", points: "320,100 320,200 360,200 360,100", number: "11", x: 340, y: 130 },
        { id: "room-12-7", points: "480,50 480,150 560,150 560,50", number: "12", x: 500, y: 130 },
        { id: "room-13-7", points: "560,50 560,150 640,150 640,50", number: "13", x: 620, y: 130 },
        { id: "room-14-7", points: "640,50 640,150 680,150 680,50", number: "14", x: 660, y: 130 },
        { id: "room-15-7", points: "920,50 920,150 1010,150 1010,50", number: "15", x: 940, y: 130 },
        { id: "room-16-7", points: "1010,50 1010,150 1100,150 1100,50", number: "16", x: 1080, y: 130 },
        { id: "room-17-7", points: "1245,100 1245,200 1370,200 1370,100", number: "17", x: 1350, y: 130 },
        { id: "room-18-7", points: "1245,100 1245,150 1295,150 1295,100", number: "18", x: 1265, y: 120 },
        { id: "room-19-7", points: "1320,50 1320,100 1370,100 1370,200 1400,200 1400,50", number: "19", x: 1360, y: 70 },
        { id: "room-20-7", points: "1400,50 1400,200 1490,200 1490,50", number: "20", x: 1420, y: 130 },

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
        { id: "door-1-7", points: "70,200 90,200" },
        { id: "door-2-7", points: "250,200 270,200" },
        { id: "door-3-7", points: "160,180 160,160" },
        { id: "door-4-7", points: "160,110 160,100" },
        { id: "door-5-7", points: "65,250 85,250" },
        { id: "door-6-7", points: "260,250 280,250" },
        { id: "door-7-7", points: "445,250 460,250" },
        { id: "door-8-7", points: "430,260 430,275" },
        { id: "door-9-7", points: "530,200 550,200" },
        { id: "door-10-7", points: "660,200 680,200" },
        { id: "door-11-7", points: "760,200 780,200" },
        { id: "door-12-7", points: "1070,200 1085,200" },
        { id: "door-13-7", points: "1120,250 1140,250" },
        { id: "door-14-7", points: "1400,250 1420,250" },
        { id: "door-15-7", points: "330,200 340,200" },
        { id: "door-16-7", points: "370,200 390,200" },
        { id: "door-17-7", points: "500,150 520,150" },
        { id: "door-18-7", points: "600,150 620,150" },
        { id: "door-19-7", points: "650,150 670,150" },
        { id: "door-20-7", points: "1020,150 1030,150" },
        { id: "door-21-7", points: "1080,150 1090,150" },
        { id: "door-22-7", points: "1255,200 1275,200" },
        { id: "door-23-7", points: "1370,200 1390,200" },
        { id: "door-24-7", points: "1430,200 1450,200" },

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