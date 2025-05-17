import ladderIcon from "./лестница.png";

interface FiveBuildingSecondFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

export const FiveBuildingSecondFloor: React.FC<FiveBuildingSecondFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="120,200 120,250 640,250 640,300 740,300 740,250 1560,250 1560,200 820,200 820,150 560,150 560,200" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        strokeWidth="1"
        data-type="corridor"
        data-floor="1" />
    <text x="200" y="220" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text> 
        

{[
        { id: "room-1-1", points: "50,150 50,200 150,200 150,150", number: "", x: 70, y: 170 },
        { id: "room-2-1", points: "150,150 150,200 180,200 180,150", number: "", x: 70, y: 170 },
        { id: "room-3-1", points: "180,150 180,200 220,200 220,150", number: "", x: 200, y: 170 },
        { id: "room-4-1", points: "220,150 220,200 260,200 260,150", number: "", x: 240, y: 170 },
        { id: "room-5-1", points: "260,150 260,200 300,200 300,150", number: "", x: 240, y: 170 },
        { id: "room-6-1", points: "300,150 300,200 380,200 380,150", number: "209", x: 330, y: 170 },
        { id: "room-7-1", points: "380,150 380,200 480,200 480,150", number: "211", x: 420, y: 170 },
        { id: "room-8-1", points: "480,150 480,200 520,200 520,150", number: "213", x: 500, y: 170 },
        { id: "room-9-1", points: "520,150 520,200 560,200 560,150", number: "215", x: 540, y: 170 },
        
        { id: "room-10-1", points: "560,50 560,150 600,150 600,50", number: "217", x: 580, y: 100 },
        { id: "room-11-1", points: "600,50 600,150 660,150 660,50", number: "219", x: 630, y: 100 },
        { id: "room-12-1", points: "720,50 720,150 750,150 750,50", number: "221", x: 735, y: 100 },
        { id: "room-13-1", points: "750,50 750,150 780,150 780,50", number: "", x: 740, y: 100 },
        { id: "room-14-1", points: "780,50 780,150 820,150 820,50", number: "223", x: 800, y: 100 },

        { id: "room-15-1", points: "820,150 820,300 920,300 920,150", number: "229", x: 870, y: 230 },
        
        { id: "room-17-1", points: "950,150 950,200 990,200 990,150", number: "233", x: 970, y: 170 },
        { id: "room-18-1", points: "990,150 990,200 1030,200 1030,150", number: "235", x: 1010, y: 170 },
        { id: "room-19-1", points: "1030,150 1030,200 1100,200 1100,150", number: "237", x: 1065, y: 170 },
        { id: "room-20-1", points: "1100,150 1100,200 1220,200 1220,150", number: "239", x: 1150, y: 170 },
        
        { id: "room-22-1", points: "1260,150 1260,200 1380,200 1380,150", number: "241", x: 1310, y: 170 },
        { id: "room-23-1", points: "1380,150 1380,200 1440,200 1440,150", number: "243", x: 1410, y: 170 },
        { id: "room-24-1", points: "1440,150 1440,200 1500,200 1500,150", number: "245", x: 1470, y: 170 },
        

        { id: "room-26-1", points: "120,250 120,300 160,300 160,250", number: "", x: 140, y: 270 },
        { id: "room-27-1", points: "160,250 160,300 200,300 200,250", number: "", x: 180, y: 270 },
        { id: "room-28-1", points: "200,250 200,300 300,300 300,250", number: "", x: 240, y: 270 },
        { id: "room-29-1", points: "300,250 300,300 340,300 340,250", number: "210", x: 320, y: 270 },
        { id: "room-30-1", points: "340,250 340,300 390,300 390,250", number: "212", x: 370, y: 270 },
        { id: "room-31-1", points: "390,250 390,300 460,300 460,250", number: "214", x: 420, y: 270 },
        { id: "room-32-1", points: "460,250 460,300 480,300 480,250", number: "216", x: 465, y: 270 },
        { id: "room-33-1", points: "480,250 480,300 560,300 560,250", number: "217", x: 520, y: 270 },
        { id: "room-34-1", points: "580,250 580,300 600,300 600,250", number: "221", x: 580, y: 270 },
        { id: "room-35-1", points: "600,220 600,300 750,300 750,220", number: "224", x: 670, y: 270 },
        { id: "room-36-1", points: "770,250 770,300 790,300 790,250", number: "226", x: 780, y: 270 },
        { id: "room-37-1", points: "920,250 920,300 1030,300 1030,250", number: "228", x: 980, y: 270 },
        { id: "room-38-1", points: "1030,250 1030,300 1100,300 1100,250", number: "230", x: 1060, y: 270 },
        { id: "room-39-1", points: "1100,250 1100,300 1240,300 1240,250", number: "232", x: 1150, y: 270 },
        { id: "room-40-1", points: "1240,250 1240,300 1340,300 1340,250", number: "234", x: 1290, y: 270 },
        { id: "room-41-1", points: "1340,250 1340,300 1560,300 1560,250", number: "236", x: 1440, y: 270 },
        
        

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
        { id: "door-1-5", points: "70,200 90,200" }


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
        points="660,50 660,150 720,150 720,50" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="670" y="80" 
        width="30" height="30" 
        data-associated-with="ladder-1"/>

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`}
        points="1500,150 1500,200 1560,200 1560,150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="1510" y="160" 
        width="30" height="30" 
        data-associated-with="ladder-2"/>

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`}
        points="920,150 920,200 950,200 950,150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="920" y="160" 
        width="30" height="30" 
        data-associated-with="ladder-3"/>

    <polygon 
        id="ladder-4"
        className={`ladder ${getHighlightClass('ladder-4')}`}
        points="1220,150 1220,200 1260,200 1260,150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="1225" y="160" 
        width="30" height="30" 
        data-associated-with="ladder-4"/>

    <polygon
        points="50,150 50,200 120,200 120,300 1560,300 1560,150 820,150 820,50 560,50 560,150" 
        fill="none" stroke="black" stroke-width="4" />


        </svg>
    );
};