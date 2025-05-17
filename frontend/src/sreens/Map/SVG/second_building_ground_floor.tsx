import ladderIcon from "./лестница.png";
import wardrobeIcon from "./гардероб.png";
import womentoiletIcon from "./туалет.png";

interface SecondBuildingGroundFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

export const SecondBuildingGroundFloor: React.FC<SecondBuildingGroundFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="150,250 150,400 210,400 210,300 800,300 800,430 850,430 850,260 590,260 590,210 440,210 440,260 210,260 210,250" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        strokeWidth="1"
        data-type="corridor"
        data-floor="1" />
    <text x="200" y="280" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text> 
        

{[
        { id: "room-1-1", points: "50,110 50,200 150,200 150,110", number: "", x: 70, y: 170 },
        { id: "room-2-1", points: "50,200 50,250 150,250 150,200", number: "", x: 70, y: 170 },
        { id: "room-3-1", points: "150,110 150,250 180,250 180,110", number: "", x: 70, y: 170 },
        { id: "room-4-1", points: "180,110 180,250 210,250 210,110", number: "", x: 70, y: 170 },
        { id: "room-5-1", points: "50,250 50,290 150,290 150,250", number: "", x: 70, y: 170 },
        { id: "room-6-1", points: "50,290 50,330 150,330 150,290", number: "", x: 70, y: 170 },
        { id: "room-7-1", points: "50,330 50,400 150,400 150,330", number: "109a", x: 100, y: 370 },
        { id: "room-8-1", points: "50,450 50,550 150,550 150,450", number: "101", x: 100, y: 500 },
        { id: "room-9-1", points: "50,550 50,600 150,600 150,550", number: "", x: 100, y: 500 },
        { id: "room-10-1", points: "50,600 50,650 150,650 150,600", number: "", x: 100, y: 500 },
        { id: "room-11-1", points: "150,600 150,650 210,650 210,600", number: "", x: 100, y: 500 },
        { id: "room-12-1", points: "150,550 150,600 210,600 210,550", number: "", x: 100, y: 500 },
        { id: "room-13-1", points: "150,500 150,550 210,550 210,500", number: "", x: 100, y: 500 },
        { id: "room-14-1", points: "150,450 150,500 210,500 210,450", number: "", x: 100, y: 500 },
        { id: "room-15-1", points: "150,400 150,450 210,450 210,400", number: "109", x: 180, y: 420 },

        { id: "room-16-1", points: "310,300 310,400 440,400 440,300", number: "", x: 180, y: 420 },
        { id: "room-17-1", points: "440,300 440,420 490,420 490,300", number: "", x: 180, y: 420 },
        { id: "room-18-1", points: "490,300 490,440 540,440 540,300", number: "", x: 180, y: 420 },
        { id: "room-19-1", points: "540,300 540,420 590,420 590,300", number: "120", x: 565, y: 360 },
        { id: "room-20-1", points: "590,300 590,400 760,400 760,300", number: "", x: 565, y: 360 },
        { id: "room-21-1", points: "760,300 760,400 800,400 800,300", number: "", x: 565, y: 360 },

        { id: "room-22-1", points: "800,430 800,530 850,530 850,430", number: "125", x: 825, y: 480 },
        { id: "room-23-1", points: "800,530 800,650 850,650 850,530", number: "", x: 825, y: 480 },
        { id: "room-24-1", points: "850,530 850,650 950,650 950,530", number: "", x: 825, y: 480 },
        { id: "room-25-1", points: "850,430 850,530 950,530 950,430", number: "", x: 825, y: 480 },
        { id: "room-26-1", points: "850,320 850,380 950,380 950,320", number: "124", x: 900, y: 365 },
        { id: "room-27-1", points: "850,260 850,320 950,320 950,260", number: "124а", x: 900, y: 300 },
        { id: "room-28-1", points: "900,210 900,260 950,260 950,210", number: "123а", x: 925, y: 235 },
        { id: "room-39-1", points: "900,110 900,210 950,210 950,110", number: "", x: 925, y: 235 },
        { id: "room-40-1", points: "850,110 850,210 900,210 900,110", number: "", x: 925, y: 235 },
        { id: "room-41-1", points: "800,110 800,210 850,210 850,110", number: "", x: 925, y: 235 },

        { id: "room-29-1", points: "850,210 850,260 900,260 900,210", number: "", x: 925, y: 235 },
        { id: "room-30-1", points: "800,210 800,260 850,260 850,210", number: "", x: 925, y: 235 },
        { id: "room-31-1", points: "710,210 710,260 760,260 760,210", number: "", x: 925, y: 235 },
        { id: "room-32-1", points: "690,210 690,260 710,260 710,210", number: "", x: 925, y: 235 },
        { id: "room-33-1", points: "660,210 660,260 690,260 690,210", number: "", x: 925, y: 235 },
        { id: "room-34-1", points: "590,210 590,260 660,260 660,210", number: "117", x: 625, y: 235 },

        { id: "room-35-1", points: "550,110 550,160 590,160 590,110", number: "", x: 625, y: 235 },
        { id: "room-36-1", points: "530,110 530,210 550,210 550,110", number: "", x: 625, y: 235 },
        { id: "room-37-1", points: "440,110 440,210 490,210 490,110", number: "114", x: 465, y: 160 },
        { id: "room-38-1", points: "210,210 210,260 440,260 440,210", number: "", x: 625, y: 235 },

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
        points="50,400 50,450 150,450 150,400" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="1"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="80" y="410" 
        width="30" height="30" 
        data-associated-with="ladder-1"/>

    <polygon 
        id="wardrobe-1" 
        className={`wardrobe ${getHighlightClass('wardrobe-1')}`} 
        points="210,300 210,400 310,400 310,300" 
        fill="#6C5B7B" 
        stroke="black" 
        stroke-width="1" 
        data-type="wardrobe"
        data-floor="1"/>
    <image 
        href={wardrobeIcon} 
        x="245" y="335" 
        width="30" height="30" 
        data-associated-with="wardrobe-1"/> 

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-1')}`}
        points="850,380 850,430 950,430 950,380" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="1"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="885" y="390" 
        width="30" height="30" 
        data-associated-with="ladder-2"/>

    <polygon 
        id="womentoilet-1" 
        className={`womentoilet ${getHighlightClass('womentoilet-1')}`} 
        points="760,210 760,260 800,260 800,210" 
        fill=" #F4C2C2" 
        stroke="black" 
        stroke-width="1" 
        data-type="womentoilet"
        data-floor="1"/>
    <image 
        href={womentoiletIcon} 
        x="765" y="220" 
        width="30" height="30" 
        data-associated-with='womentoilet-1'/> 

    <polygon 
        id="womentoilet-2" 
        className={`womentoilet ${getHighlightClass('womentoilet-2')}`} 
        points="550,160 550,210 590,210 590,160" 
        fill=" #F4C2C2" 
        stroke="black" 
        stroke-width="1" 
        data-type="womentoilet"
        data-floor="1"/>
    <image 
        href={womentoiletIcon} 
        x="555" y="170" 
        width="30" height="30" 
        data-associated-with='womentoilet-2'/>

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`}
        points="490,110 490,210 530,210 530,110" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="1"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="495" y="140" 
        width="30" height="30" 
        data-associated-with="ladder-3"/>

    <polygon
        points="50,110 50,650 210,650 210,400 440,400 440,420 490,420 490,440 540,440 540,420 590,420 590,400 800,400 800,650 
        950,650 950,110 800,110 800,210 590,210 590,110 440,110 440,210 210,210 210,110" 
        fill="none" stroke="black" stroke-width="4" />

        </svg>
    );
};