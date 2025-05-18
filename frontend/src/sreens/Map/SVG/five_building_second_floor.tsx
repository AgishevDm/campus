import ladderIcon from "./лестница.png";
import womentoiletIcon from "./туалет.png";

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
        

{[
        { id: "room-1-1", points: "50,1150 50,1200 150,1200 150,1150", number: "", x: 70, y: 1170 },
        { id: "room-2-1", points: "150,1150 150,1200 180,1200 180,1150", number: "", x: 70, y: 1170 },
        { id: "room-3-1", points: "180,1150 180,1200 220,1200 220,1150", number: "", x: 200, y: 1170 },
        { id: "room-4-1", points: "220,1150 220,1200 260,1200 260,1150", number: "", x: 240, y: 1170 },
        { id: "room-5-1", points: "260,1150 260,1200 300,1200 300,1150", number: "", x: 240, y: 1170 },
        { id: "room-6-1", points: "300,1150 300,1200 380,1200 380,1150", number: "209", x: 330, y: 1170 },
        { id: "room-7-1", points: "380,1150 380,1200 480,1200 480,1150", number: "211", x: 420, y: 1170 },
        { id: "room-8-1", points: "480,1150 480,1200 520,1200 520,1150", number: "213", x: 500, y: 1170 },
        { id: "room-9-1", points: "520,1150 520,1200 560,1200 560,1150", number: "215", x: 540, y: 1170 },
        
        { id: "room-10-1", points: "560,1050 560,1150 600,1150 600,1050", number: "217", x: 580, y: 1100 },
        { id: "room-11-1", points: "600,1050 600,1150 660,1150 660,1050", number: "219", x: 630, y: 1100 },
        { id: "room-12-1", points: "720,1050 720,1150 750,1150 750,1050", number: "221", x: 735, y: 1100 },
        { id: "room-13-1", points: "750,1050 750,1150 780,1150 780,1050", number: "", x: 740, y: 1100 },
        { id: "room-14-1", points: "780,1050 780,1150 820,1150 820,1050", number: "223", x: 800, y: 1100 },

        { id: "room-15-1", points: "820,1150 820,1300 920,1300 920,1150", number: "229", x: 870, y: 1230 },
        
        { id: "room-17-1", points: "950,1150 950,1200 990,1200 990,1150", number: "233", x: 970, y: 1170 },
        { id: "room-18-1", points: "990,1150 990,1200 1030,1200 1030,1150", number: "235", x: 1010, y: 1170 },
        { id: "room-19-1", points: "1030,1150 1030,1200 1100,1200 1100,1150", number: "237", x: 1065, y: 1170 },
        { id: "room-20-1", points: "1100,1150 1100,1200 1220,1200 1220,1150", number: "239", x: 1150, y: 1170 },
        
        { id: "room-22-1", points: "1260,1150 1260,1200 1380,1200 1380,1150", number: "241", x: 1310, y: 1170 },
        { id: "room-23-1", points: "1380,1150 1380,1200 1440,1200 1440,1150", number: "243", x: 1410, y: 1170 },
        { id: "room-24-1", points: "1440,1150 1440,1200 1500,1200 1500,1150", number: "245", x: 1470, y: 1170 },
        

        { id: "room-26-1", points: "120,1250 120,1300 160,1300 160,1250", number: "", x: 140, y: 1270 },
        { id: "room-27-1", points: "160,1250 160,1300 200,1300 200,1250", number: "", x: 180, y: 1270 },
        { id: "room-28-1", points: "200,1250 200,1300 300,1300 300,1250", number: "", x: 240, y: 1270 },
        { id: "room-29-1", points: "300,1250 300,1300 340,1300 340,1250", number: "210", x: 320, y: 1270 },
        { id: "room-30-1", points: "340,1250 340,1300 390,1300 390,1250", number: "212", x: 370, y: 1270 },
        { id: "room-31-1", points: "390,1250 390,1300 460,1300 460,1250", number: "214", x: 420, y: 1270 },
        { id: "room-32-1", points: "460,1250 460,1300 480,1300 480,1250", number: "216", x: 465, y: 1270 },
        { id: "room-33-1", points: "480,1250 480,1300 560,1300 560,1250", number: "217", x: 520, y: 1270 },
        { id: "room-34-1", points: "580,1250 580,1300 600,1300 600,1250", number: "221", x: 580, y: 1270 },
        { id: "room-35-1", points: "600,1220 600,1300 750,1300 750,1220", number: "224", x: 670, y: 1270 },
        { id: "room-36-1", points: "770,1250 770,1300 790,1300 790,1250", number: "226", x: 780, y: 1270 },
        { id: "room-37-1", points: "920,1250 920,1300 1030,1300 1030,1250", number: "228", x: 980, y: 1270 },
        { id: "room-38-1", points: "1030,1250 1030,1300 1100,1300 1100,1250", number: "230", x: 1060, y: 1270 },
        { id: "room-39-1", points: "1100,1250 1100,1300 1240,1300 1240,1250", number: "232", x: 1150, y: 1270 },
        { id: "room-40-1", points: "1240,1250 1240,1300 1340,1300 1340,1250", number: "234", x: 1290, y: 1270 },
        { id: "room-41-1", points: "1340,1250 1340,1300 1560,1300 1560,1250", number: "236", x: 1440, y: 1270 },
        

        { id: "room-61-1", points: "1680,380 1680,520 1760,520 1760,380", number: "122", x: 1720, y: 460 },
        { id: "room-62-1", points: "1680,520 1680,570 1760,570 1760,520", number: "123", x: 1720, y: 540 },
        { id: "room-63-1", points: "1680,570 1680,620 1760,620 1760,570", number: "120", x: 1720, y: 610 },
        { id: "room-64-1", points: "1680,620 1680,680 1760,680 1760,620", number: "118", x: 1720, y: 650 },
        { id: "room-65-1", points: "1680,680 1680,740 1760,740 1760,680", number: "116", x: 1720, y: 700 },
        { id: "room-66-1", points: "1680,740 1680,800 1760,800 1760,740", number: "114", x: 1720, y: 760 },
        { id: "room-67-1", points: "1680,800 1680,860 1760,860 1760,800", number: "112", x: 1720, y: 820 },
        { id: "room-68-1", points: "1670,910 1670,990 1760,990 1760,910", number: "99", x: 1720, y: 930 },
        { id: "room-69-1", points: "1670,990 1670,1060 1760,1060 1760,990", number: "97", x: 1720, y: 1010 },
        { id: "room-70-1", points: "1670,1060 1670,1130 1760,1130 1760,1060", number: "95", x: 1720, y: 1090 },
        { id: "room-71-1", points: "1670,1130 1670,1190 1760,1190 1760,1130", number: "93", x: 1720, y: 1150 },
        { id: "room-72-1", points: "1670,1190 1670,1270 1760,1270 1760,1190", number: "91", x: 1720, y: 1230 },

        { id: "room-73-1", points: "1560,1270 1560,1470 1760,1470 1760,1270", number: "97", x: 1650, y: 1300 },
        { id: "room-74-1", points: "1560,1130 1560,1190 1620,1190 1620,1130", number: "90", x: 1590, y: 1150 },
        { id: "room-75-1", points: "1560,1070 1560,1130 1620,1130 1620,1070", number: "92", x: 1590, y: 1090 },
        { id: "room-76-1", points: "1560,1000 1560,1070 1620,1070 1620,1000", number: "94", x: 1590, y: 1030 },
        { id: "room-77-1", points: "1540,920 1540,1000 1620,1000 1620,920", number: "96а", x: 1590, y: 960 },
        { id: "room-78-1", points: "1540,870 1540,920 1620,920 1620,870", number: "96", x: 1590, y: 900 },
        { id: "room-79-1", points: "1560,810 1560,870 1640,870 1640,810", number: "113", x: 1600, y: 840 },
        { id: "room-80-1", points: "1560,750 1560,810 1640,810 1640,750", number: "115", x: 1600, y: 780 },
        { id: "room-81-1", points: "1560,690 1560,750 1640,750 1640,690", number: "117", x: 1600, y: 720 },
        { id: "room-82-1", points: "1560,630 1560,690 1640,690 1640,630", number: "119", x: 1600, y: 650 },
        { id: "room-83-1", points: "1560,600 1560,630 1640,630 1640,600", number: "", x: 1600, y: 650 },
        { id: "room-84-1", points: "1560,560 1560,600 1640,600 1640,560", number: "", x: 1600, y: 650 },
        { id: "room-85-1", points: "1560,420 1560,520 1640,520 1640,420", number: "121", x: 1600, y: 470 },
        { id: "room-86-1", points: "1560,380 1560,420 1640,420 1640,380", number: "", x: 1600, y: 470 },
        

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
        points="660,1050 660,1150 720,1150 720,1050" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="670" y="1080" 
        width="30" height="30" 
        data-associated-with="ladder-1"/>

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`}
        points="1500,1150 1500,1200 1560,1200 1560,1150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="1510" y="1160" 
        width="30" height="30" 
        data-associated-with="ladder-2"/>

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`}
        points="920,1150 920,1200 950,1200 950,1150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="920" y="1160" 
        width="30" height="30" 
        data-associated-with="ladder-3"/>

    <polygon 
        id="ladder-4"
        className={`ladder ${getHighlightClass('ladder-4')}`}
        points="1220,1150 1220,1200 1260,1200 1260,1150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="1225" y="1160" 
        width="30" height="30" 
        data-associated-with="ladder-4"/>

    <polygon 
        id="mentoilet-3"
        className={`ladder ${getHighlightClass('mentoilet-3')}`}
        points="1560,520 1560,560 1640,560 1640,520" 
        fill=" #F4C2C2" 
        stroke="black" 
        stroke-width="2" 
        data-type="mentoilet"
        data-floor="1" />
    <image 
        href={womentoiletIcon} 
        x="1590" y="520" 
        width="30" height="30" 
        data-associated-with="mentoilet-3"/>

    <polygon 
        id="ladder-5"
        className={`ladder ${getHighlightClass('ladder-5')}`}
        points="1680,860 1680,910 1760,910 1760,860" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="1705" y="870" 
        width="30" height="30" 
        data-associated-with="ladder-5"/>

<polygon
        points="50,1150 50,1200 120,1200 120,1300 1560,1300 1560,1470 1760,1470 1760,380 1560,380 1560,870 
        1540,870 1540,1000 1560,1000 1560,1150 820,1150 820,1050 560,1050 560,1150" 
        fill="none" stroke="black" stroke-width="4" />

        </svg>
    );
};