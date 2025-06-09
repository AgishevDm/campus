import { GiStairs } from 'react-icons/gi';
import SvgIcon from '../../components/SvgIcon';

interface SecondBuildingFourthFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

export const SecondBuildingFourthFloor: React.FC<SecondBuildingFourthFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
      

{[
        { id: "room-1-1", points: "50,110 50,210 210,210 210,110", number: "507", x: 120, y: 160 },
        { id: "room-2-1", points: "50,210 50,280 170,280 170,210", number: "506", x: 110, y: 250 },
        { id: "room-3-1", points: "50,280 50,350 170,350 170,280", number: "505", x: 110, y: 320 },
        { id: "room-4-1", points: "50,350 50,400 170,400 170,350", number: "504", x: 110, y: 375 },
        { id: "room-5-1", points: "50,450 50,550 170,550 170,450", number: "503", x: 110, y: 500 },
        { id: "room-6-1", points: "50,550 50,650 120,650 120,550", number: "502", x: 80, y: 600 },
        { id: "room-7-1", points: "120,550 120,650 210,650 210,550", number: "501", x: 165, y: 600 },

        { id: "room-8-1", points: "230,240 230,400 280,400 280,240", number: "509", x: 255, y: 320},
        { id: "room-9-1", points: "280,210 280,400 440,400 440,210", number: "514", x: 360, y: 300},
        { id: "room-10-1", points: "440,270 440,420 490,420 490,270", number: "512", x: 465, y: 340},
        { id: "room-11-1", points: "490,270 490,420 590,420 590,270", number: "511", x: 540, y: 340},

        { id: "room-12-1", points: "590,300 590,400 660,400 660,300", number: "509а", x: 625, y: 340},
        { id: "room-13-1", points: "590,210 590,260 660,260 660,210", number: "513а", x: 625, y: 230},

        { id: "room-14-1", points: "530,110 530,210 590,210 590,110", number: "513", x: 560, y: 150},
        { id: "room-15-1", points: "440,110 440,210 490,210 490,110", number: "509", x: 465, y: 150},

        { id: "room-16-1", points: "660,210 660,400 780,400 780,210", number: "510", x: 720, y: 300},
        { id: "room-17-1", points: "800,110 800,210 950,210 950,110", number: "517", x: 875, y: 160},

        { id: "room-18-1", points: "850,210 850,280 950,280 950,210", number: "518", x: 895, y: 240},
        { id: "room-19-1", points: "850,280 850,380 950,380 950,280", number: "519", x: 895, y: 330},
        { id: "room-20-1", points: "850,430 850,490 950,490 950,430", number: "520", x: 895, y: 460},
        { id: "room-21-1", points: "850,490 850,560 950,560 950,490", number: "521", x: 895, y: 525},
        { id: "room-22-1", points: "800,560 800,650 880,650 880,560", number: "522", x: 840, y: 600},
        

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
        points="50,400 50,450 170,450 170,400" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="1"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={90} y={410} Icon={ GiStairs } />

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-1')}`}
        points="850,380 850,430 950,430 950,380" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="1"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={880} y={390} Icon={ GiStairs } />

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
        points="50,110 50,650 210,650 210,400 440,400 440,420 490,420 540,420 590,420 590,400 800,400 800,650 
        950,650 950,110 800,110 800,210 590,210 590,110 440,110 440,210 210,210 210,110" 
        fill="none" stroke="black" stroke-width="4" />

    

        </svg>
    );
};