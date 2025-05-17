import ladderIcon from "./лестница.png";
import buffetIcon from "./буфет.png";

interface SecondBuildingThirdFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

export const SecondBuildingThirdFloor: React.FC<SecondBuildingThirdFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="50,210 50,260 150,260 150,320 120,320 120,600 160,600 160,560 150,560 150,400 210,400 210,280 380,280 380,210" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        strokeWidth="1"
        data-type="corridor"
        data-floor="1" />
    <text x="150" y="240" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text> 

    <polygon
        id="corridor-2"
        className={`corridor ${getHighlightClass('corridor-2')}`}
        points="440,210 440,300 550,300 550,260 590,260 590,280 800,280 800,430 840,430 840,650 870,650 870,380 850,380 850,210" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        strokeWidth="1"
        data-type="corridor"
        data-floor="1" />
{[
        { id: "room-1-1", points: "50,110 50,210 210,210 210,110", number: "411", x: 120, y: 160 },
        { id: "room-2-1", points: "50,260 50,320 150,320 150,260", number: "410", x: 100, y: 290 },
        { id: "room-3-1", points: "50,320 50,400 120,400 120,320", number: "407", x: 85, y: 360 },
        { id: "room-4-1", points: "50,440 50,500 120,500 120,440", number: "406", x: 85, y: 475 },
        { id: "room-5-1", points: "50,500 50,560 120,560 120,500", number: "", x: 85, y: 475 },
        { id: "room-6-1", points: "50,560 50,600 120,600 120,560", number: "403", x: 85, y: 580 },
        { id: "room-7-1", points: "50,600 50,650 120,650 120,600", number: "404", x: 85, y: 625 },
        { id: "room-8-1", points: "120,600 120,650 210,650 210,600", number: "402", x: 160, y: 625 },
        { id: "room-9-1", points: "160,560 160,600 210,600 210,560", number: "401", x: 185, y: 580 },
        { id: "room-10-1", points: "150,520 150,560 210,560 210,520", number: "", x: 185, y: 580 },
        { id: "room-11-1", points: "150,400 150,520 210,520 210,400", number: "408", x: 175, y: 460 },

        { id: "room-12-1", points: "210,280 210,400 260,400 260,280", number: "414", x: 235, y: 340 },
        { id: "room-13-1", points: "260,280 260,400 300,400 300,280", number: "", x: 235, y: 340 },
        { id: "room-14-1", points: "300,280 300,400 440,400 440,280", number: "418", x: 370, y: 340 },
        { id: "room-15-1", points: "440,300 440,420 590,420 590,300", number: "419", x: 515, y: 360 },
        { id: "room-16-1", points: "590,280 590,400 670,400 670,280", number: "422", x: 630, y: 340 },
        { id: "room-17-1", points: "670,280 670,400 750,400 750,280", number: "424", x: 710, y: 340 },
        { id: "room-18-1", points: "750,280 750,400 800,400 800,280", number: "427", x: 775, y: 340 },

        { id: "room-19-1", points: "800,430 800,550 840,550 840,430", number: "440", x: 820, y: 490 },
        { id: "room-20-1", points: "800,550 800,600 840,600 840,550", number: "439", x: 820, y: 575 },
        { id: "room-21-1", points: "800,600 800,650 840,650 840,600", number: "438", x: 820, y: 625 },
        { id: "room-22-1", points: "870,600 870,650 950,650 950,600", number: "437", x: 910, y: 625 },
        { id: "room-23-1", points: "870,550 870,600 950,600 950,550", number: "436", x: 910, y: 575 },
        { id: "room-24-1", points: "870,490 870,550 950,550 950,490", number: "435", x: 910, y: 520 },
        { id: "room-25-1", points: "870,430 870,490 950,490 950,430", number: "434", x: 910, y: 460 },
        { id: "room-26-1", points: "850,340 850,380 950,380 950,340", number: "", x: 910, y: 460 },
        { id: "room-27-1", points: "850,280 850,340 950,340 950,280", number: "431", x: 900, y: 310 },
        { id: "room-28-1", points: "850,210 850,280 950,280 950,210", number: "432", x: 900, y: 250 },
        { id: "room-29-1", points: "850,170 850,210 950,210 950,170", number: "428", x: 900, y: 190 },
        { id: "room-30-1", points: "850,110 850,170 950,170 950,110", number: "429", x: 900, y: 140 },
        { id: "room-31-1", points: "800,110 800,210 850,210 850,110", number: "430", x: 825, y: 160 },

        { id: "room-32-1", points: "520,110 520,210 590,210 590,110", number: "420", x: 560, y: 160 },
        { id: "room-33-1", points: "440,110 440,210 500,210 500,110", number: "415", x: 465, y: 160 },
        { id: "room-34-1", points: "380,210 380,280 440,280 440,210", number: "417", x: 410, y: 250 },

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
    <image 
        href={ladderIcon} 
        x="70" y="410" 
        width="30" height="30" 
        data-associated-with="ladder-1"/>

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-1')}`}
        points="870,380 870,430 950,430 950,380" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="1"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="890" y="390" 
        width="30" height="30" 
        data-associated-with="ladder-2"/>

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
        id="dining-1"
        className={`dining ${getHighlightClass('dining-1')}`}
        points="550,300 550,260 590,260 590,300"
        fill="#FF6F61"
        stroke="#6B4226"
        strokeWidth="1"
        data-type="dining"
        data-floor="1"
      />
      <image 
        href={buffetIcon} 
        x="555" y="265" 
        width="30" height="30"
        data-associated-with="dining-1"
      />

    <polygon
        points="50,110 50,650 210,650 210,400 440,400 440,420 490,420 540,420 590,420 590,400 800,400 800,650 
        950,650 950,110 800,110 800,210 590,210 590,110 440,110 440,210 210,210 210,110" 
        fill="none" stroke="black" stroke-width="4" />

    

        </svg>
    );
};