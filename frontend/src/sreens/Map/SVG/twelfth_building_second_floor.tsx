import { GiStairs } from 'react-icons/gi';
import SvgIcon from './SvgIcon';

interface TwelfthBuildingFSecondFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const TwelfthBuildingSecondFloor: React.FC<TwelfthBuildingFSecondFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="50,200 840,200 840,170 960,170 960,200 
        1200,200 1200,170 1250,170 1250,130 1300,130 
        1300,280 1220,280 1220,250 960,250 960,360 
        840,360 840,250 470,250 470,360 290,360 290,250 
        50,250" 
        fill="#f9f9ff" stroke="#6633FF" stroke-width="1" />
    <text x="150" y="230" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>
    <polygon 
        id="ladder-1"
        className={`ladder ${getHighlightClass('ladder-1')}`} 
        points="430,100 430,200 480,200 480,100" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={440} y={140} Icon={ GiStairs } />

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`} 
        points="1000,100 1000,200 1050,200 1050,100" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={1010} y={140} Icon={ GiStairs } />

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`} 
        points="1200,100 1200,170 1250,170 1250,100" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={1210} y={130} Icon={ GiStairs } />

    <polygon 
        id="ladder-4"
        className={`ladder ${getHighlightClass('ladder-4')}`} 
        points="50,250 50,320 100,320 100,250" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={60} y={270} Icon={ GiStairs } />

{[
        { id: "room-202-2", points: "200,100 200,200 280,200 280,100", number: "202", x: 240, y: 150 },
        { id: "room-204-2", points: "280,100 280,200 380,200 380,100", number: "204", x: 230, y: 150 },
        { id: "room-204-A-2", points: "380,100 380,170 430,170 430,100", number: "204A", x: 405, y: 150 },
        { id: "room-0-2", points: "380,170 380,200 430,200 430,170", number: "0", x: 0, y: 0 },
        { id: "room-206-2", points: "480,100 480,200 580,200 580,100", number: "206", x: 530, y: 150 },
        { id: "room-0-0-2", points: "580,100 580,200 620,200 620,100", number: "0", x: 0, y: 0 },
        { id: "room-210-2", points: "620,100 620,200 680,200 680,100", number: "210", x: 650, y: 150 },
        { id: "room-0-0-0-2", points: "680,100 680,200 740,200 740,100", number: "0", x: 0, y: 0 },
        { id: "room-212-2", points: "740,100 740,200 790,200 790,100", number: "212", x: 765, y: 150 },
        { id: "room-214-2", points: "790,100 790,200 840,200 840,100", number: "214", x: 815, y: 150 },
        { id: "room-216-2", points: "840,70 840,170 960,170 960,70", number: "216", x: 900, y: 120 },
        { id: "room-216-A-2", points: "960,100 960,200 1000,200 1000,100", number: "216A", x: 980, y: 150 },
        { id: "room-0-0-0-0-2", points: "1050,130 1050,200 1100,200 1100,130", number: "0", x: 0, y: 0 },
        { id: "room-220-2", points: "1100,130 1100,200 1200,200 1200,130", number: "220", x: 1150, y: 170 },
        { id: "room-222-2", points: "1300,130 1300,250 1450,250 1450,130", number: "222", x: 1370, y: 190 },
        { id: "room-201-2", points: "100,250 100,320 150,320 150,250", number: "201", x: 125, y: 290 },
        { id: "room-203-2", points: "150,250 150,320 200,320 200,250", number: "203", x: 175, y: 290 },
        { id: "room-205-2", points: "200,250 200,350 250,350 250,250", number: "205", x: 225, y: 300 },
        { id: "room-207-2", points: "250,250 250,350 290,350 290,250", number: "207", x: 270, y: 300 },
        { id: "room-209-2", points: "470,250 470,350 525,350 525,250", number: "209", x: 495, y: 300 },
        { id: "room-0-0-0-0-0-2", points: "525,250 525,350 580,350 580,250", number: "0", x: 0, y: 0 },
        { id: "room-213-2", points: "580,250 580,350 625,350 625,250", number: "213", x: 605, y: 300 },
        { id: "room-215-2", points: "625,250 625,350 680,350 680,250", number: "215", x: 650, y: 300 },
        { id: "room-217-2", points: "680,250 680,350 730,350 730,250", number: "217", x: 705, y: 300 },
        { id: "room-219-2", points: "730,250 730,350 840,350 840,250", number: "219", x: 780, y: 300 },
        { id: "room-1-2", points: "960,250 960,330 1000,330 1000,250", number: "0", x: 0, y: 0 },
        { id: "room-2-2", points: "1000,300 1000,330 1060,330 1060,300", number: "0", x: 0, y: 0 },
        { id: "room-3-2", points: "1000,250 1000,300 1030,300 1030,250", number: "0", x: 0, y: 0 },
        { id: "room-4-2", points: "1030,250 1030,300 1060,300 1060,250", number: "0", x: 0, y: 0 },
        { id: "room-221-2", points: "1060,250 1060,310 1200,310 1200,250", number: "221", x: 1120, y: 270 },
        { id: "room-5-2", points: "1140,250 1140,310 1220,310 1220,250", number: "0", x: 0, y: 0 },
        { id: "room-223-2", points: "1220,280 1220,330 1300,330 1300,280", number: "223", x: 1160, y: 310 },
        { id: "room-224-2", points: "1300,250 1300,360 1450,360 1450,250", number: "224", x: 1375, y: 300 },

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
        { id: "door-1-2", points: "230,200 250,200" },
        { id: "door-2-2", points: "380,190 380,180" },
        { id: "door-3-2", points: "395,170 415,170" },
        { id: "door-4-2", points: "395,200 415,200" },
        { id: "door-5-2", points: "540,200 560,200" },
        { id: "door-6-2", points: "620,190 620,170" },
        { id: "door-7-2", points: "640,200 660,200" },
        { id: "door-8-2", points: "690,200 710,200" },
        { id: "door-9-2", points: "740,190 740,170" },
        { id: "door-10-2", points: "805,200 825,200" },
        { id: "door-11-2", points: "850,170 870,170" },
        { id: "door-12-2", points: "920,170 940,170" },
        { id: "door-13-2", points: "970,200 990,200" },
        { id: "door-14-2", points: "1160,200 1180,200" },
        { id: "door-15-2", points: "1100,190 1100,170" },
        { id: "door-16-2", points: "1300,150 1300,170" },
        { id: "door-17-2", points: "115,250 135,250" },
        { id: "door-18-2", points: "165,250 185,250" },
        { id: "door-19-2", points: "215,250 235,250" },
        { id: "door-20-2", points: "260,250 280,250" },
        { id: "door-21-2", points: "490,250 510,250" },
        { id: "door-22-2", points: "540,250 560,250" },
        { id: "door-23-2", points: "525,260 525,280" },
        { id: "door-24-2", points: "590,250 610,250" },
        { id: "door-25-2", points: "640,250 660,250" },
        { id: "door-26-2", points: "695,250 715,250" },
        { id: "door-27-2", points: "750,250 770,250" },
        { id: "door-28-2", points: "970,250 990,250" },
        { id: "door-29-2", points: "1010,250 1020,250" },
        { id: "door-30-2", points: "1000,310 1000,320" },
        { id: "door-31-2", points: "1030,260 1030,270" },
        { id: "door-32-2", points: "1070,250 1090,250" },
        { id: "door-33-2", points: "1140,280 1140,300" },
        { id: "door-34-2", points: "1230,280 1250,280" },
        { id: "door-35-2", points: "1300,270 1300,260" },

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
        points="50,200 50,320 200,320 200,350 290,350 
        290,360 470,360 470,350 840,350 840,360 960,360 
        960,330 1060,330 1060,310 1220,310 1220,330 1300,330 
        1300,360 1450,360 1450,130 1250,130 1250,100 1200,100 
        1200,130 1050,130 1050,100 960,100 960,70 840,70 840,100 
        200,100 200,200" 
        fill="none" stroke="black" stroke-width="2" />
        </svg>
    );
};