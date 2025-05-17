import ladderIcon from "./лестница.png";
import womentoiletIcon from "./туалет.png";
import buffetIcon from "./буфет.png";


interface FiveBuildingFirstFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const FiveBuildingFirstFloor: React.FC<FiveBuildingFirstFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        { id: "room-1-1", points: "50,150 50,200 100,200 100,150", number: "", x: 70, y: 170 },
        { id: "room-2-1", points: "100,150 100,200 200,200 200,150", number: "", x: 150, y: 170 },
        { id: "room-3-1", points: "200,150 200,200 300,200 300,150", number: "", x: 250, y: 170 },
        { id: "room-4-1", points: "300,150 300,200 400,200 400,150", number: "107", x: 350, y: 170 },
        { id: "room-5-1", points: "400,150 400,200 440,200 440,150", number: "109", x: 420, y: 170 },
        { id: "room-6-1", points: "440,150 440,200 500,200 500,150", number: "111", x: 470, y: 170 },
        { id: "room-7-1", points: "500,150 500,200 560,200 560,150", number: "113", x: 530, y: 170 },
        { id: "room-8-1", points: "560,50 560,150 600,150 600,50", number: "115", x: 580, y: 100 },
        { id: "room-9-1", points: "600,50 600,150 660,150 660,50", number: "119", x: 630, y: 100 },
        { id: "room-10-1", points: "720,50 720,150 820,150 820,50", number: "121", x: 770, y: 100 },
        { id: "room-11-1", points: "820,150 820,200 920,200 920,150", number: "125", x: 870, y: 170 },
        { id: "room-12-1", points: "970,150 970,200 1010,200 1010,150", number: "129", x: 990, y: 170 },
        { id: "room-13-1", points: "1010,150 1010,200 1060,200 1060,150", number: "127", x: 1030, y: 170 },
        { id: "room-14-1", points: "1060,150 1060,200 1110,200 1110,150", number: "123", x: 1080, y: 170 },
        { id: "room-15-1", points: "1110,150 1110,200 1160,200 1160,150", number: "131", x: 1130, y: 170 },
        { id: "room-16-1", points: "1160,150 1160,200 1210,200 1210,150", number: "137", x: 1180, y: 170 },
        { id: "room-17-1", points: "1210,150 1210,200 1260,200 1260,150", number: "135", x: 1230, y: 170 },
        { id: "room-18-1", points: "1260,150 1260,200 1310,200 1310,150", number: "", x: 1700, y: 170 },
        { id: "room-19-1", points: "1310,150 1310,200 1370,200 1370,150", number: "139", x: 1340, y: 170 },
        { id: "room-20-1", points: "1370,150 1370,200 1420,200 1420,150", number: "141", x: 1390, y: 170 },
        { id: "room-21-1", points: "1420,150 1420,200 1470,200 1470,150", number: "143", x: 1440, y: 170 },
        { id: "room-22-1", points: "1470,150 1470,200 1510,200 1510,150", number: "147", x: 1490, y: 170 },

        { id: "room-24-1", points: "120,250 120,300 200,300 200,250", number: "", x: 430, y: 270 },

        { id: "room-25-1", points: "300,250 300,300 340,300 340,250", number: "106", x: 320, y: 270 },
        { id: "room-26-1", points: "340,250 340,300 400,300 400,250", number: "108", x: 370, y: 270 },
        { id: "room-27-1", points: "400,250 400,300 440,300 440,250", number: "110", x: 420, y: 270 },
        { id: "room-28-1", points: "440,250 440,300 480,300 480,250", number: "112", x: 460, y: 270 },
        { id: "room-29-1", points: "480,250 480,300 560,300 560,250", number: "114", x: 520, y: 270 },
        { id: "room-34-1", points: "600,250 600,300 640,300 640,250", number: "116", x: 620, y: 270 },
        { id: "room-35-1", points: "740,250 740,300 780,300 780,250", number: "120", x: 760, y: 270 },
        { id: "room-36-1", points: "820,250 820,300 880,300 880,250", number: "122", x: 850, y: 270 },
        { id: "room-37-1", points: "880,250 880,300 940,300 940,250", number: "124", x: 910, y: 270 },
        { id: "room-38-1", points: "940,250 940,300 970,300 970,250", number: "126", x: 955, y: 270 },
        { id: "room-39-1", points: "970,250 970,300 1060,300 1060,250", number: "128", x: 1010, y: 270 },
        { id: "room-40-1", points: "1060,250 1060,300 1160,300 1160,250", number: "130", x: 1100, y: 270 },
        { id: "room-41-1", points: "1160,250 1160,300 1260,300 1260,250", number: "134", x: 1200, y: 270 },
        { id: "room-42-1", points: "1260,250 1260,300 1300,300 1300,250", number: "132", x: 1280, y: 270 },
        { id: "room-43-1", points: "1300,250 1300,300 1370,300 1370,250", number: "136", x: 1340, y: 270 },
        { id: "room-44-1", points: "1370,250 1370,300 1440,300 1440,250", number: "140", x: 1400, y: 270 },
        { id: "room-45-1", points: "1440,250 1440,300 1480,300 1480,250", number: "142", x: 1460, y: 270 },
        { id: "room-45-1", points: "1480,250 1480,300 1560,300 1560,250", number: "144", x: 1510, y: 270 },
        
        

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
        className={`dining ${getHighlightClass('ladder-1')}`}
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
        id="mentoilet-1"
        className={`dining ${getHighlightClass('mentoilet-1')}`}
        points="560,250 560,300 600,300 600,250" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="mentoilet"
        data-floor="1" />
    <image 
        href={womentoiletIcon} 
        x="565" y="260" 
        width="30" height="30" 
        data-associated-with="mentoilet-1"/> 

    <polygon 
        id="mentoilet-1"
        className={`ladder ${getHighlightClass('mentoilet-1')}`}
        points="780,250 780,300 820,300 820,250" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="mentoilet"
        data-floor="1" />
    <image 
        href={womentoiletIcon} 
        x="785" y="260" 
        width="30" height="30" 
        data-associated-with="mentoilet-1"/>

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`}
        points="920,150 920,200 970,200 970,150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="930" y="160" 
        width="30" height="30" 
        data-associated-with="ladder-2"/>

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`}
        points="1260,150 1260,200 1310,200 1310,150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="1270" y="160" 
        width="30" height="30" 
        data-associated-with="ladder-3"/>

<polygon 
        id="ladder-4"
        className={`ladder ${getHighlightClass('ladder-4')}`}
        points="1510,150 1510,200 1560,200 1560,150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <image 
        href={ladderIcon} 
        x="1520" y="160" 
        width="30" height="30" 
        data-associated-with="ladder-4"/>

    <polygon 
        id="dining-1"
        className={`ladder ${getHighlightClass('dining-1')}`} 
        points="200,250 200,300 300,300 300,250" 
        fill="#FF6F61" 
        stroke="black" 
        stroke-width="1" 
        data-type="dining"
        data-floor="1"/>
    <image 
        href={buffetIcon}
        x="230" y="260" 
        width="30" height="30" 
        data-associated-with="ladder-1"/>

    <polygon
        points="50,150 50,200 120,200 120,300 1560,300 1560,150 820,150 820,50 560,50 560,150" 
        fill="none" stroke="black" stroke-width="4" />


        </svg>
    );
};