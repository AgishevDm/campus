import ladderIcon from "./лестница.png";
import wardrobeIcon from "./гардероб.png";

  interface TwelfthBuildingFirstFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const TwelfthBuildingFirstFloor: React.FC<TwelfthBuildingFirstFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="100,200 100,200 740,200 740,200 740,170 780,170
         780,200 890,200 890,170 920,170 920,200 1010,200 1010,250
          100,250" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        stroke-width="1" 
        data-type="corridor"
        data-floor="1"/>
    <text x="150" y="230" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>

    <polygon 
        id="ladder-1"
        className={`ladder ${getHighlightClass('ladder-1')}`} 
        points="360,100 360,200 410,200 410,100" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <image 
        href={ladderIcon} 
        x="370" y="140" 
        width="30" height="30" 
        data-associated-with="ladder-1"/>

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`} 
        points="960,100 960,200 1010,200 1010,100" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <image 
        href={ladderIcon} 
        x="970" y="140" 
        width="30" height="30" 
        data-associated-with="ladder-2"/>   

    <polygon 
        id="wardrobe-1"
        className={`wardrobe ${getHighlightClass('wardrobe-1')}`} 
        points="310,250 310,350 410,350 410,250" 
        fill="#6C5B7B" 
        stroke="black" 
        stroke-width="1" 
        data-type="wardrobe"
        data-floor="1"/>
    <image 
        href={wardrobeIcon} 
        x="345" y="285" 
        width="30" height="30" 
        data-associated-with="wardrobe-1"/>

{[
        { id: "room-102-2", points: "100,100 100,200 200,200 200,100", number: "102", x: 150, y: 150 },
        { id: "room-104-2", points: "200,100 200,200 270,200 270,100", number: "104", x: 230, y: 150 },
        { id: "room-0-2", points: "310,100 310,170 360,170 360,100", number: "0", x: 0, y: 0 },
        { id: "room-0-0-2", points: "270,100 270,200 310,200 310,100", number: "0", x: 0, y: 0 },
        { id: "room-0-0-0-2", points: "310,170 310,200 360,200 360,170", number: "0", x: 0, y: 0 },
        { id: "room-106-2", points: "410,100 410,200 460,200 460,100", number: "106", x: 435, y: 150 },
        { id: "room-108-2", points: "460,100 460,200 510,200 510,100", number: "108", x: 485, y: 150 },
        { id: "room-112-2", points: "510,100 510,200 560,200 560,100", number: "112", x: 535, y: 150 },
        { id: "room-114-2", points: "560,100 560,200 610,200 610,100", number: "114", x: 585, y: 150 },
        { id: "room-116-2", points: "610,100 610,200 740,200 740,100", number: "116", x: 670, y: 150 },
        { id: "room-120-2", points: "740,50 740,170 840,170 840,50", number: "120", x: 790, y: 130 },
        { id: "room-0-0-0-0-2", points: "780,170 780,200 840,200 840,170", number: "0", x: 0, y: 0 },
        { id: "room-0-0-0-0-0-2", points: "840,170 840,200 890,200 890,170", number: "0", x: 0, y: 0 },
        { id: "room-122-2", points: "840,50 840,170 920,170 920,50", number: "122", x: 880, y: 130 },
        { id: "room-124-2", points: "920,100 920,200 960,200 960,100", number: "124", x: 940, y: 130 },
        { id: "room-101-2", points: "100,250 100,350 210,350 210,250", number: "101", x: 150, y: 300 },
        { id: "room-103-2", points: "210,250 210,350 310,350 310,250", number: "103", x: 250, y: 300 },
        { id: "room-15-2", points: "410,250 410,350 610,350 610,250", number: "15", x: 510, y: 300 },
        { id: "room-109-2", points: "610,250 610,350 740,350 740,250", number: "109", x: 670, y: 300 },
        { id: "room-111-2", points: "740,250 740,350 920,350 920,250", number: "111", x: 830, y: 300 },
        { id: "room-2", points: "920,250 920,290 960,290 960,250", number: "0", x: 0, y: 0 },
        { id: "room-0-0-0-0-0-0-2", points: "920,290 920,350 960,350 960,290", number: "0", x: 0, y: 0 },
        { id: "room-0-0-0-0-0-0-0-2", points: "960,250 960,290 1010,290 1010,250", number: "0", x: 0, y: 0 },
        { id: "room-0-0-0-0-0-0-0-0-2", points: "960,290 960,350 1010,350 1010,290", number: "0", x: 0, y: 0 },

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
        { id: "door-1-2", points: "130,200 110,200" },
        { id: "door-2-2", points: "160,200 180,200" },
        { id: "door-3-2", points: "220,200 240,200" },
        { id: "door-4-2", points: "270,150 270,170" },
        { id: "door-5-2", points: "310,180 310,190" },
        { id: "door-6-2", points: "325,170 345,170" },
        { id: "door-7-2", points: "325,200 345,200" },
        { id: "door-8-2", points: "425,200 445,200" },
        { id: "door-9-2", points: "475,200 495,200" },
        { id: "door-10-2", points: "525,200 545,200" },
        { id: "door-11-2", points: "610,160 610,180" },
        { id: "door-12-2", points: "630,200 650,200" },
        { id: "door-13-2", points: "750,170 770,170" },
        { id: "door-14-2", points: "780,180 780,190" },
        { id: "door-15-2", points: "890,180 890,190" },
        { id: "door-16-2", points: "900,170 910,170" },
        { id: "door-17-2", points: "930,200 950,200" },
        { id: "door-18-2", points: "160,250 180,250" },
        { id: "door-19-2", points: "260,250 280,250" },
        { id: "door-20-2", points: "450,250 470,250" },
        { id: "door-21-2", points: "560,250 580,250" },
        { id: "door-22-2", points: "670,250 690,250" },
        { id: "door-23-2", points: "780,250 800,250" },
        { id: "door-24-2", points: "930,250 950,250" },
        { id: "door-25-2", points: "930,290 950,290" },
        { id: "door-26-2", points: "960,270 960,289" },
        { id: "door-27-2", points: "975,290 995,290" },

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
        points="100,100 100,350 1010,350 1010,100 920,100 920,50 
        740,50 740,100" 
        fill="none" stroke="black" stroke-width="2" />
        </svg>
    );
};