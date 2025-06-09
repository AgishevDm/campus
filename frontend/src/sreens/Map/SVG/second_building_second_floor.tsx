import { BiDrink } from 'react-icons/bi';
import { GiStairs } from 'react-icons/gi';
import SvgIcon from './SvgIcon';

interface SecondBuildingSecondFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

export const SecondBuildingSecondFloor: React.FC<SecondBuildingSecondFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="50,210 50,270 150,270 150,340 120,340 120,550 150,550 150,400 160,400 160,360 210,360 210,300 440,300 440,320 590,320 590,300 
        800,300 800,380 840,380 840,650 870,650 870,210" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        strokeWidth="1"
        data-type="corridor"
        data-floor="1" />
    <text x="100" y="240" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>       

{[
        { id: "room-1-1", points: "50,110 50,210 150,210 150,110", number: "311", x: 100, y: 160 },
        { id: "room-2-1", points: "150,110 150,210 210,210 210,110", number: "310", x: 180, y: 160 },
        { id: "room-3-1", points: "50,340 50,270 150,270 150,340", number: "307", x: 100, y: 310 },
        { id: "room-4-1", points: "50,400 50,340 120,340 120,400", number: "306", x: 85, y: 370 },
        { id: "room-5-1", points: "50,500 50,450 120,450 120,500", number: "304", x: 85, y: 475 },
        { id: "room-6-1", points: "50,550 50,500 120,500 120,550", number: "302", x: 85, y: 525 },
        { id: "room-7-1", points: "50,650 50,550 160,550 160,650", number: "301", x: 100, y: 600 },
        { id: "room-8-1", points: "160,650 160,550 210,550 210,650", number: "", x: 100, y: 600 },
        { id: "room-9-1", points: "150,550 150,500 210,500 210,550", number: "303", x: 180, y: 525 },
        { id: "room-10-1", points: "150,500 150,400 210,400 210,500", number: "305", x: 180, y: 450 },

        { id: "room-11-1", points: "210,400 210,330 270,330 270,400", number: "308", x: 240, y: 360 },
        { id: "room-12-1", points: "210,330 210,300 270,300 270,330", number: "307", x: 240, y: 315 },
        { id: "room-13-1", points: "270,400 270,300 370,300 370,400", number: "312", x: 320, y: 350 },
        { id: "room-14-1", points: "370,400 370,300 410,300 410,400", number: "314", x: 390, y: 350 },
        { id: "room-15-1", points: "410,400 410,300 440,300 440,400", number: "315", x: 425, y: 350 },
        { id: "room-16-1", points: "440,420 440,320 590,320 590,420", number: "Музей истории ", x: 515, y: 370 },
        { id: "room-17-1", points: "590,400 590,300 640,300 640,400", number: "320", x: 615, y: 350 },
        { id: "room-18-1", points: "640,400 640,300 740,300 740,400", number: "321", x: 690, y: 350 },
        { id: "room-19-1", points: "740,400 740,300 770,300 770,400", number: "321", x: 755, y: 350 },
        { id: "room-20-1", points: "770,400 770,300 800,300 800,400", number: "323", x: 785, y: 350 },

        { id: "room-21-1", points: "800,430 800,380 840,380 840,430", number: "326", x: 820, y: 405 },
        { id: "room-22-1", points: "800,550 800,430 840,430 840,550", number: "330", x: 820, y: 490 },
        { id: "room-23-1", points: "800,600 800,550 840,550 840,600", number: "335", x: 820, y: 575 },
        { id: "room-24-1", points: "800,650 800,600 840,600 840,650", number: "334", x: 820, y: 630 },
        { id: "room-25-1", points: "870,650 870,600 950,600 950,650", number: "333", x: 910, y: 630 },
        { id: "room-26-1", points: "870,600 870,550 950,550 950,600", number: "332", x: 910, y: 575 },
        { id: "room-27-1", points: "870,550 870,470 950,470 950,550", number: "331", x: 910, y: 510 },
        { id: "room-28-1", points: "870,470 870,430 950,430 950,470", number: "", x: 910, y: 450 },
        { id: "room-29-1", points: "870,340 870,380 950,380 950,340", number: "328", x: 910, y: 360 },
        { id: "room-30-1", points: "870,300 870,340 950,340 950,300", number: "327", x: 910, y: 320 },
        { id: "room-31-1", points: "870,210 870,300 950,300 950,210", number: "325", x: 910, y: 260 },
        { id: "room-32-1", points: "800,110 800,210 950,210 950,110", number: "324", x: 870, y: 160 },

        { id: "room-33-1", points: "520,110 520,210 590,210 590,110", number: "317", x: 560, y: 160 },
        { id: "room-34-1", points: "440,110 440,210 490,210 490,110", number: "316", x: 465, y: 160 },

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
        id="dining-1"
        className={`dining ${getHighlightClass('dining-1')}`}
        points="160,400 160,360 210,360 210,400"
        fill="#FF6F61"
        stroke="#6B4226"
        strokeWidth="1"
        data-type="dining"
        data-floor="1"
      />
    <SvgIcon x={170} y={365} Icon={ BiDrink } />

    <polygon
        points="50,110 50,650 210,650 210,400 440,400 440,420 490,420 540,420 590,420 590,400 800,400 800,650 
        950,650 950,110 800,110 800,210 590,210 590,110 440,110 440,210 210,210 210,110" 
        fill="none" stroke="black" stroke-width="4" />



        </svg>
    );
};