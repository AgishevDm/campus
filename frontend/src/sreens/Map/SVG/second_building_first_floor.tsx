import { BiDrink } from 'react-icons/bi';
import { GiStairs } from 'react-icons/gi';
import SvgIcon from './SvgIcon';

interface SecondBuildingFirstFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

export const SecondBuildingFirstFloor: React.FC<SecondBuildingFirstFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="100,170 100,300 120,300 120,500 150,500 150,400 260,400 260,300 800,300 800,440 840,440 840,610 870,610 
        870,260 900,260 900,110 870,110 870,210 590,210 590,110 530,110 530,210 210,210 130,210 130,170" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        strokeWidth="1"
        data-type="corridor"
        data-floor="1" />
    <text x="300" y="280" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>        

{[
        { id: "room-1-1", points: "50,110 50,170 130,170 130,110", number: "215", x: 90, y: 145 },
        { id: "room-2-1", points: "130,110 130,230 210,230 210,110", number: "216", x: 170, y: 145 },
        { id: "room-3-1", points: "50,170 50,230 100,230 100,170", number: "214", x: 75, y: 200 },
        { id: "room-4-1", points: "50,230 50,300 100,300 100,230", number: "213", x: 75, y: 270 },
        { id: "room-5-1", points: "50,300 50,400 120,400 120,300", number: "210", x: 85, y: 350 },
        { id: "room-6-1", points: "50,450 50,500 120,500 120,450", number: "", x: 85, y: 350 },
        { id: "room-7-1", points: "50,500 50,570 160,570 160,500", number: "", x: 85, y: 350 },
        { id: "room-8-1", points: "50,570 50,650 210,650 210,570", number: "", x: 85, y: 350 },
        { id: "room-9-1", points: "150,470 150,570 210,570 210,470", number: "207", x: 180, y: 520 },
        { id: "room-10-1", points: "150,400 150,470 210,470 210,400", number: "209", x: 180, y: 430 },
        { id: "room-11-1", points: "150,300 150,370 210,370 210,300", number: "211", x: 180, y: 340 },
        { id: "room-12-1", points: "150,230 150,300 210,300 210,230", number: "", x: 180, y: 340 },

        { id: "room-13-1", points: "210,210 210,260 300,260 300,210", number: "", x: 180, y: 340 },
        { id: "room-14-1", points: "300,210 300,260 350,260 350,210", number: "", x: 180, y: 340 },
        { id: "room-15-1", points: "350,210 350,260 400,260 400,210", number: "", x: 180, y: 340 },
        { id: "room-16-1", points: "400,210 400,260 440,260 440,210", number: "", x: 180, y: 340 },

        { id: "room-17-1", points: "260,300 260,400 360,400 360,300", number: "", x: 180, y: 340 },
        { id: "room-18-1", points: "360,300 360,400 400,400 400,300", number: "", x: 180, y: 340 },
        { id: "room-19-1", points: "400,300 400,400 440,400 440,300", number: "", x: 180, y: 340 },
        { id: "room-20-1", points: "440,300 440,420 490,420 490,300", number: "222", x: 465, y: 350 },
        { id: "room-21-1", points: "590,300 590,400 740,400 740,300", number: "225", x: 670, y: 350 },
        { id: "room-22-1", points: "740,300 740,400 800,400 800,300", number: "226", x: 770, y: 350 },
        { id: "room-23-1", points: "800,580 800,650 840,650 840,580", number: "241", x: 820, y: 610 },
        { id: "room-24-1", points: "800,440 800,580 840,580 840,440", number: "236", x: 820, y: 500 },
        { id: "room-25-1", points: "870,430 870,490 950,490 950,430", number: "237", x: 910, y: 460 },
        { id: "room-26-1", points: "870,490 870,550 950,550 950,490", number: "239", x: 910, y: 520 },
        { id: "room-27-1", points: "870,550 870,610 950,610 950,550", number: "240б", x: 910, y: 580 },
        { id: "room-28-1", points: "840,610 840,650 950,650 950,610", number: "240а", x: 890, y: 630 },

        { id: "room-29-1", points: "870,340 870,390 950,390 950,340", number: "235", x: 910, y: 360 },
        { id: "room-30-1", points: "870,300 870,340 950,340 950,300", number: "234", x: 910, y: 320 },
        { id: "room-31-1", points: "900,210 900,300 950,300 950,210", number: "232", x: 920, y: 285 },
        { id: "room-32-1", points: "870,260 870,300 900,300 900,260", number: "233", x: 885, y: 285 },
        { id: "room-33-1", points: "900,160 900,210 950,210 950,160", number: "231", x: 925, y: 185 },
        { id: "room-34-1", points: "900,110 900,160 950,160 950,110", number: "230", x: 925, y: 135 },
        { id: "room-35-1", points: "800,110 800,210 870,210 870,110", number: "229", x: 835, y: 160 },

        { id: "room-36-1", points: "440,110 440,210 490,210 490,110", number: "221", x: 465, y: 160 },
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
        { id: "door-1-5", points: "70,200 70,200" }


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
        id="ladder-1"
        className={`ladder ${getHighlightClass('ladder-1')}`}
        points="50,400 50,450 120,450 120,400" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="1"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={70} y={410} Icon={ GiStairs } />

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-1')}`}
        points="870,380 870,430 950,430 950,380" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="1"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={890} y={390} Icon={ GiStairs } />

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`}
        points="490,110 490,210 530,210 530,110" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="1"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={495} y={140} Icon={ GiStairs } />

<polygon 
        id="ladder-4"
        className={`ladder ${getHighlightClass('ladder-4')}`}
        points="490,300 490,440 540,440 540,300" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="1"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={500} y={360} Icon={ GiStairs } />

<polygon
        id="dining-1"
        className={`dining ${getHighlightClass('dining-1')}`}
        points="540,300 540,420 590,420 590,300"
        fill="#FF6F61"
        stroke="#6B4226"
        strokeWidth="1"
        data-type="dining"
        data-floor="1"
      />
    <SvgIcon x={550} y={350} Icon={ BiDrink } />

    <polygon
        points="50,110 50,650 210,650 210,400 440,400 440,420 490,420 490,440 540,440 540,420 590,420 590,400 800,400 800,650 
        950,650 950,110 800,110 800,210 590,210 590,110 440,110 440,210 210,210 210,110" 
        fill="none" stroke="black" stroke-width="4" />



        </svg>
    );
};