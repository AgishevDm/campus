import ladderIcon from "./лестница.png";
import elevatorIcon from "./лифт.png";
import womentoiletIcon from "./туалет.png";


interface EighthBuildingFourthFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const EighthBuildingFourthFloor: React.FC<EighthBuildingFourthFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="50,200 50,250 300,250 300,250 480,250 480,200 
        1100,200 1100,250 1490,250 1530,225 1490,200 1150,200 
        1150,100 1100,100 1100,150 820,150 820,50 720,50 720,150 480,150 
        480,100 440,100 440,200 360,200"
        fill="#f9f9ff"
        stroke="#6633FF"
        strokeWidth="1"
        data-type="corridor"
        data-floor="1"
      />
    <text x="100" y="220" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>

    <polygon 
        id="ladder-1"
        className={`ladder ${getHighlightClass('ladder-1')}`}
        points="820,50 820,150 920,150 920,50" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2"
        data-type="ladder"
        data-floor="1" 
        />
    <image 
      href={ladderIcon} 
      x="880" y="90" 
      width="30" height="30" 
      data-associated-with="ladder-1"/>

    <polygon
        id="elevator-1" 
        className={`elevator ${getHighlightClass('elevator-1')}`}
        points="1140,100 1140,200 1175,200 1175,100" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="elevator"
        data-floor="1"/>
    <image 
      href={elevatorIcon} 
      x="1140" y="140" 
      width="30" height="30" 
      data-associated-with="elevator-1"/>

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`}
        points="360,100 360,200 400,200 400,100" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="ladder"
        data-floor="2"/>
    <image 
      href={ladderIcon} 
      x="370" y="140" 
      width="30" height="30" 
      data-associated-with="ladder-2"/>

    <polygon 
        id="elevator-2"
        className={`elevator ${getHighlightClass('elevator-2')}`}
        points="400,100 400,200 440,200 440,100" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="elevator"
        data-floor="2"/>
    <image 
      href={elevatorIcon} 
      x="405" y="140" 
      width="30" height="30" 
      data-associated-with="elevator-2"/>

    <polygon 
        id="elevator-3"
        className={`elevator ${getHighlightClass('elevator-3')}`}
        points="680,50 680,150 720,150 720,50" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="elevator"
        data-floor="3"/>
    <image 
      href={elevatorIcon} 
      x="685" y="90" 
      width="30" height="30" 
      data-associated-with="elevator-3"/>

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`}
        points="1175,100 1175,200 1210,200 1210,100" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="ladder"
        data-floor="3" />
    <image 
        href={ladderIcon} 
        x="1180" y="140" 
        width="30" height="30" 
        data-associated-with="ladder-3"/>

    <polygon 
        id="mentoilet-1"
        className={`mentoilet ${getHighlightClass('mentoilet-1')}`}
        points="1210,100 1210,200 1245,200 1245,100" 
        fill="#663366" 
        stroke="black" 
        stroke-width="2" 
        data-type="mentoilet"
        data-floor="1"/>
    <image 
        href={womentoiletIcon} 
        x="1213" y="140" 
        width="30" height="30" 
        data-associated-with="mentoilet-1"/>    

    {[
        { id: "room-1-4", points: "50,50 50,200 150,200 150,50", number: "1", x: 100, y: 100 },
        { id: "room-2-4", points: "50,250 50,340 110,340 110,250", number: "2", x: 60, y: 280 },
        { id: "room-3-4", points: "110,250 110,340 185,340 185,250", number: "3", x: 120, y: 280 },
        { id: "room-4-4", points: "185,250 185,340 260,340 260,250", number: "4", x: 200, y: 280 },
        { id: "room-5-4", points: "260,250 260,340 305,340 305,250", number: "5", x: 280, y: 280 },
        { id: "room-6-4", points: "305,250 305,340 385,340 385,250", number: "6", x: 320, y: 280 },
        { id: "room-7-4", points: "385,280 385,340 430,340 430,280", number: "7", x: 400, y: 300 },
        { id: "room-8-4", points: "430,250 430,340 480,340 480,250", number: "8", x: 460, y: 280 },
        { id: "room-9-4", points: "480,200 480,300 520,300 520,200", number: "9", x: 500, y: 250 },
        { id: "room-10-4", points: "520,200 520,300 560,300 560,200", number: "10", x: 540, y: 250 },
        { id: "room-11-4", points: "560,200 560,300 600,300 600,200", number: "11", x: 580, y: 250 },
        { id: "room-12-4", points: "600,200 600,300 640,300 640,200", number: "12", x: 620, y: 250 },
        { id: "room-13-4", points: "640,200 640,300 720,300 720,200", number: "13", x: 670, y: 250 },
        { id: "room-14-4", points: "720,200 720,300 870,300 870,200", number: "14", x: 800, y: 250 },
        { id: "room-15-4", points: "870,200 870,300 920,300 920,200", number: "15", x: 890, y: 250 },
        { id: "room-16-4", points: "920,200 920,300 1010,300 1010,200", number: "16", x: 940, y: 250 },
        { id: "room-17-4", points: "1010,200 1010,300 1060,300 1060,200", number: "17", x: 1030, y: 250 },
        { id: "room-18-4", points: "1060,200 1060,300 1100,300 1100,200", number: "18", x: 1080, y: 250 },
        { id: "room-19-4", points: "1100,250 1100,340 1250,340 1250,250", number: "19", x: 1200, y: 300 },
        { id: "room-20-4", points: "1250,250 1250,340 1290,340 1290,250", number: "20", x: 1270, y: 300 },
        { id: "room-21-4", points: "1290,250 1290,340 1490,340 1490,250", number: "21", x: 1340, y: 300 },
        { id: "room-22-4", points: "1430,250 1430,300 1490,300 1490,250", number: "22", x: 1460, y: 270 },
        { id: "room-23-4", points: "150,50 150,200 240,200 240,50", number: "23", x: 180, y: 100 },
        { id: "room-24-4", points: "240,100 240,200 280,200 280,100", number: "24", x: 260, y: 130 },
        { id: "room-25-4", points: "280,100 280,200 320,200 320,100", number: "25", x: 300, y: 130 },
        { id: "room-26-4", points: "320,100 320,200 360,200 360,100", number: "26", x: 340, y: 130 },
        { id: "room-27-4", points: "480,50 480,150 560,150 560,50", number: "27", x: 500, y: 130 },
        { id: "room-28-4", points: "560,50 560,150 640,150 640,50", number: "28", x: 580, y: 130 },
        { id: "room-29-4", points: "640,50 640,150 680,150 680,50", number: "29", x: 660, y: 130 },
        { id: "room-30-4", points: "920,50 920,150 960,150 960,50", number: "30", x: 940, y: 130 },
        { id: "room-31-4", points: "960,50 960,150 1100,150 1100,50", number: "31", x: 1080, y: 130 },
        { id: "room-32-4", points: "1245,100 1245,200 1285,200 1285,100", number: "32", x: 1260, y: 130 },
        { id: "room-33-4", points: "1285,100 1285,200 1320,200 1320,100", number: "33", x: 1300, y: 130 },
        { id: "room-34-4", points: "1320,50 1320,200 1490,200 1490,50", number: "34", x: 1360, y: 130 },
        { id: "room-35-4", points: "1430,140 1430,200 1490,200 1490,140" , number: "35", x: 1470, y: 160 },
        { id: "room-36-4", points: "385,250 385,280 430,280 430,250" , number: "0", x: 0, y: 0 },

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
        { id: "door-1-4", points: "130,200 110,200" },
        { id: "door-2-4", points: "70,250 90,250" },
        { id: "door-3-4", points: "110,260 110,280" },
        { id: "door-4-4", points: "185,250 185,270" },
        { id: "door-5-4", points: "170,250 200,250" },
        { id: "door-6-4", points: "275,250 285,250" },
        { id: "door-7-4", points: "315,250 325,250" },
        { id: "door-8-4", points: "400,280 420,280" },
        { id: "door-9-4", points: "400,250 420,250" },
        { id: "door-10-4", points: "440,250 460,250" },
        { id: "door-11-4", points: "495,200 505,200" },
        { id: "door-12-4", points: "535,200 545,200" },
        { id: "door-13-4", points: "590,200 610,200" },
        { id: "door-14-4", points: "600,210 600,220" },
        { id: "door-15-4", points: "650,200 665,200" },
        { id: "door-16-4", points: "695,200 710,200" },
        { id: "door-17-4", points: "760,200 780,200" },
        { id: "door-18-4", points: "885,200 900,200" },
        { id: "door-18-4", points: "930,200 950,200" },
        { id: "door-19-4", points: "1020,200 1040,200" },
        { id: "door-20-4", points: "1070,200 1090,200" },
        { id: "door-21-4", points: "1130,250 1150,250" },
        { id: "door-22-4", points: "1260,250 1270,250" },
        { id: "door-23-4", points: "1360,250 1380,250" },
        { id: "door-24-4", points: "1450,300 1470,300" },
        { id: "door-25-4", points: "180,200 200,200" },
        { id: "door-26-4", points: "250,200 270,200" },
        { id: "door-27-4", points: "290,200 310,200" },
        { id: "door-28-4", points: "330,200 340,200" },
        { id: "door-29-4", points: "370,200 390,200" },
        { id: "door-30-4", points: "520,150 540,150" },
        { id: "door-31-4", points: "610,150 630,150" },
        { id: "door-32-4", points: "650,150 670,150" },
        { id: "door-33-4", points: "940,150 950,150" },
        { id: "door-34-4", points: "980,150 1000,150" },
        { id: "door-35-4", points: "1060,150 1080,150" },
        { id: "door-36-4", points: "1255,200 1275,200" },
        { id: "door-37-4", points: "1295,200 1310,200" },
        { id: "door-38-4", points: "1370,200 1390,200" },
        { id: "door-39-4", points: "1430,180 1430,160" },

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
        points="50,50 50,340 480,340 480,300 1100,300 1100,340 
        1490,340 1490,250 1530,225 1490,200 1490,50 1320,50 1320,100 1100,100 1100,50 480,50 480,100 
        240,100 240,50" 
        fill="none" stroke="black" stroke-width="4" />
        </svg>
    );
};