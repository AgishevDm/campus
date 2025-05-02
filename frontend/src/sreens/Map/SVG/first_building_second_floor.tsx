import ladderIcon from "./лестница.png";

interface FirstBuildingSecondFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const FirstBuildingSecondFloor: React.FC<FirstBuildingSecondFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="300,200 300,300 520,300 520,830 550,830 
        550,300 590,300 590,230 1160,230 1160,300 1200,300 
        1200,830 1230,830 1230,300 1300,300 1300,230 1380,230 
        1380,200" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        stroke-width="1" 
        data-type="corridor"
        data-floor="1"/>
    <text x="350" y="230" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>

    <polygon 
        id="ladder-1"
        className={`ladder ${getHighlightClass('ladder-1')}`} 
        points="1080,300 1080,230 1160,230 1160,300" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <image 
        href={ladderIcon} 
        x="1100" y="250" 
        width="30" height="30" 
        data-associated-with="ladder-1"/>

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`} 
        points="1230,620 1230,580 1300,580 1300,620" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <image 
        href={ladderIcon} 
        x="1250" y="585" 
        width="30" height="30" 
        data-associated-with="ladder-2"/>

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`} 
        points="580,300 580,230 660,230 660,300" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <image 
        href={ladderIcon} 
        x="610" y="250" 
        width="30" height="30" 
        data-associated-with="ladder-3"/>

    <polygon 
        id="ladder-4"
        className={`ladder ${getHighlightClass('ladder-4')}`}  
        points="450,600 450,560 520,560 520,600" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"
        />
    <image 
        href={ladderIcon} 
        x="470" y="565" 
        width="30" height="30" 
        data-associated-with="ladder-4"/>
{[
        { id: "room-1-2", points: "100,100 100,300 300,300 300,100", number: "1", x: 240, y: 150 },
        { id: "room-2-2", points: "300,120 300,200 360,200 360,120", number: "2", x: 340, y: 150 },
        { id: "room-3-2", points: "360,120 360,200 390,200 390,120", number: "3", x: 380, y: 150 },
        { id: "room-4-2", points: "390,120 390,200 450,200 450,120", number: "4", x: 420, y: 150 },
        { id: "room-5-2", points: "450,120 450,200 500,200 500,120", number: "5", x: 470, y: 150 },
        { id: "room-6-2", points: "500,120 500,200 580,200 580,120", number: "6", x: 550, y: 150 },
        { id: "room-7-2", points: "580,120 580,200 620,200 620,120", number: "7", x: 600, y: 150 },
        { id: "room-8-2", points: "620,120 620,200 670,200 670,120", number: "8", x: 650, y: 150 },
        { id: "room-9-2", points: "670,120 670,200 740,200 740,120", number: "9", x: 710, y: 150 },
        { id: "room-10-2", points: "740,120 740,200 790,200 790,120", number: "10", x: 760, y: 150 },
        { id: "room-11-2", points: "790,120 790,200 890,200 890,120", number: "11", x: 850, y: 150 },
        { id: "room-12-2", points: "890,120 890,200 970,200 970,120", number: "12", x: 940, y: 150 },
        { id: "room-13-2", points: "970,120 970,200 1030,200 1030,120", number: "13", x: 1000, y: 150 },
        { id: "room-14-2", points: "1030,120 1030,200 1080,200 1080,120", number: "14", x: 1050, y: 150 },
        { id: "room-15-2", points: "1080,120 1080,200 1120,200 1120,120", number: "15", x: 1100, y: 150 },
        { id: "room-16-2", points: "1120,120 1120,200 1160,200 1160,120", number: "16", x: 1140, y: 150 },
        { id: "room-17-2", points: "1160,120 1160,200 1200,200 1200,120", number: "17", x: 1180, y: 150 },
        { id: "room-18-2", points: "1200,120 1200,200 1250,200 1250,120", number: "18", x: 1230, y: 150 },
        { id: "room-19-2", points: "1250,120 1250,200 1300,200 1300,120", number: "19", x: 1280, y: 150 },
        { id: "room-20-2", points: "1300,120 1300,200 1380,200 1380,120", number: "20", x: 1340, y: 150 },
        { id: "room-21-2", points: "1380,100 1380,300 1580,300 1580,100", number: "21", x: 1500, y: 150 },
        { id: "room-22-2", points: "1300,300 1300,230 1380,230 1380,300", number: "22", x: 1340, y: 250 },
        { id: "room-23-2", points: "1280,300 1280,230 1300,230 1300,300", number: "23", x: 1290, y: 250 },
        { id: "room-24-2", points: "1230,300 1230,230 1280,230 1280,300", number: "24", x: 1250, y: 250 },
        { id: "room-25-2", points: "1230,420 1230,300 1300,300 1300,420", number: "25", x: 1250, y: 350 },
        { id: "room-26-2", points: "1230,500 1230,420 1300,420 1300,500", number: "26", x: 1250, y: 450 },
        { id: "room-27-2", points: "1230,540 1230,500 1300,500 1300,540", number: "27", x: 1250, y: 520 },
        { id: "room-28-2", points: "1230,580 1230,540 1300,540 1300,580", number: "28", x: 1250, y: 560 },
        { id: "room-29-2", points: "1230,670 1230,620 1300,620 1300,670", number: "29", x: 1250, y: 640 },
        { id: "room-30-2", points: "1230,710 1230,670 1300,670 1300,710", number: "30", x: 1250, y: 690 },
        { id: "room-31-2", points: "1230,830 1230,710 1300,710 1300,830", number: "31", x: 1250, y: 760 },
        { id: "room-32-2", points: "1130,830 1130,760 1200,760 1200,830", number: "32", x: 1150, y: 780 },
        { id: "room-33-2", points: "1130,760 1130,630 1200,630 1200,760", number: "33", x: 1150, y: 700 },
        { id: "room-34-2", points: "1130,630 1130,580 1200,580 1200,630", number: "34", x: 1150, y: 600 },
        { id: "room-35-2", points: "1130,580 1130,500 1200,500 1200,580", number: "35", x: 1150, y: 550 },
        { id: "room-36-2", points: "1130,500 1130,460 1200,460 1200,500", number: "36", x: 1150, y: 480 },
        { id: "room-37-2", points: "1130,460 1130,420 1200,420 1200,460", number: "37", x: 1150, y: 440 },
        { id: "room-38-2", points: "1130,420 1130,380 1200,380 1200,420", number: "38", x: 1150, y: 400 },
        { id: "room-39-2", points: "1130,380 1130,340 1200,340 1200,380", number: "39", x: 1150, y: 360 },
        { id: "room-40-2", points: "1130,340 1130,300 1200,300 1200,340", number: "40", x: 1150, y: 320 },
        { id: "room-41-2", points: "550,340 550,300 620,300 620,340", number: "41", x: 600, y: 320 },
        { id: "room-42-2", points: "550,380 550,340 620,340 620,380", number: "42", x: 600, y: 360 },
        { id: "room-43-2", points: "550,480 550,380 620,380 620,480", number: "43", x: 600, y: 400 },
        { id: "room-44-2", points: "550,560 550,480 620,480 620,560", number: "44", x: 600, y: 510 },
        { id: "room-45-2", points: "550,600 550,560 620,560 620,600", number: "45", x: 600, y: 580 },
        { id: "room-46-2", points: "550,650 550,600 620,600 620,650", number: "46", x: 600, y: 620 },
        { id: "room-47-2", points: "550,740 550,650 620,650 620,740", number: "47", x: 600, y: 680 },
        { id: "room-48-2", points: "550,830 550,740 620,740 620,830", number: "48", x: 600, y: 700 },
        { id: "room-49-2", points: "450,830 450,650 520,650 520,830", number: "49", x: 470, y: 760 },
        { id: "room-50-2", points: "450,650 450,600 520,600 520,650", number: "50", x: 470, y: 620 },
        { id: "room-51-2", points: "450,460 450,560 520,560 520,460", number: "51", x: 470, y: 500 },
        { id: "room-52-2", points: "450,420 450,460 520,460 520,420", number: "52", x: 470, y: 440 },
        { id: "room-53-2", points: "450,380 450,420 520,420 520,380", number: "53", x: 470, y: 400 },
        { id: "room-54-2", points: "450,340 450,380 520,380 520,340", number: "54", x: 470, y: 360 },
        { id: "room-55-2", points: "450,300 450,340 520,340 520,300", number: "55", x: 470, y: 320 },
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
        { id: "door-1-2", points: "300,210 300,230" },
        { id: "door-2-2", points: "300,250 300,270" },
        { id: "door-3-2", points: "340,200 350,200" },
        { id: "door-4-2", points: "370,200 380,200" },
        { id: "door-5-2", points: "410,200 430,200" },
        { id: "door-6-2", points: "465,200 480,200" },
        { id: "door-7-2", points: "530,200 550,200" },
        { id: "door-8-2", points: "580,190 580,170" },
        { id: "door-9-2", points: "670,190 670,170" },
        { id: "door-10-2", points: "700,200 720,200" },
        { id: "door-11-2", points: "790,190 790,170" },
        { id: "door-12-2", points: "830,200 850,200" },
        { id: "door-13-2", points: "920,200 940,200" },
        { id: "door-14-2", points: "970,190 970,170" },
        { id: "door-15-2", points: "1050,200 1065,200" },
        { id: "door-16-2", points: "1090,200 1110,200" },
        { id: "door-17-2", points: "1130,200 1150,200" },
        { id: "door-18-2", points: "1170,200 1190,200" },
        { id: "door-19-2", points: "1220,200 1240,200" },
        { id: "door-20-2", points: "1270,200 1290,200" },
        { id: "door-21-2", points: "1310,200 1330,200" },
        { id: "door-22-2", points: "1380,200 1380,230" },
        { id: "door-23-2", points: "1310,230 1320,230" },
        { id: "door-24-2", points: "1285,230 1295,230" },
        { id: "door-25-2", points: "1240,300 1250,300" },
        { id: "door-26-2", points: "1230,350 1230,370" },
        { id: "door-27-2", points: "1230,470 1230,490" },
        { id: "door-28-2", points: "1230,510 1230,530" },
        { id: "door-29-2", points: "1230,550 1230,570" },
        { id: "door-30-2", points: "1230,635 1230,655" },
        { id: "door-31-2", points: "1230,680 1230,700" },
        { id: "door-32-2", points: "1230,800 1230,820" },
        { id: "door-33-2", points: "1200,800 1200,820" },
        { id: "door-34-2", points: "1200,640 1200,660" },
        { id: "door-35-2", points: "1200,590 1200,610" },
        { id: "door-36-2", points: "1200,510 1200,530" },
        { id: "door-37-2", points: "1200,470 1200,490" },
        { id: "door-38-2", points: "1200,430 1200,450" },
        { id: "door-39-2", points: "1200,390 1200,410" },
        { id: "door-40-2", points: "1200,350 1200,370" },
        { id: "door-41-2", points: "1200,310 1200,330" },
        { id: "door-42-2", points: "550,325 550,335" },
        { id: "door-43-2", points: "550,345 550,355" },
        { id: "door-44-2", points: "550,450 550,470" },
        { id: "door-45-2", points: "550,530 550,550" },
        { id: "door-46-2", points: "550,570 550,590" },
        { id: "door-47-2", points: "550,620 550,640" },
        { id: "door-48-2", points: "550,710 550,730" },
        { id: "door-49-2", points: "550,750 550,770" },
        { id: "door-50-2", points: "520,790 520,810" },
        { id: "door-51-2", points: "520,660 520,680" },
        { id: "door-52-2", points: "520,615 520,635" },
        { id: "door-53-2", points: "520,530 520,550" },
        { id: "door-54-2", points: "520,430 520,450" },
        { id: "door-55-2", points: "520,390 520,410" },
        { id: "door-56-2", points: "520,350 520,370" },
        { id: "door-57-2", points: "520,310 520,330" },

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
        points="100,100 300,100 300,120 1380,120 1380,100 
        1580,100 1580,300 1300,300 1300,830 1130,830 1130,300 
        1080,300 1080,230 660,230 660,300 620,300 620,830 
        450,830 450,300 100,300" 
        fill="none" stroke="black" stroke-width="2" />
            </svg>
    );
};