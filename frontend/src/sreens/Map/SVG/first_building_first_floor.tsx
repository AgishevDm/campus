import ladderIcon from "./лестница.png";
import womentoiletIcon from "./туалет.png";
import buffetIcon from "./буфет.png";

  interface FirstBuildingFirstFloorProps {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const FirstBuildingFirstFloor: React.FC<FirstBuildingFirstFloorProps> = ({ onBackClick, onRoomClick = () => {},
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
        points="300,200 300,230 500,230 500,300 520,300 
    520,700 450,700 450,830 620,830 620,720 550,720 
    550,300 580,300 580,230 660,230 660,300 1060,300 
    1060,230 1140,230 1140,300 1130,300 1130,330 
    1200,330 1200,740 1130,740 1130,780 1200,780 
    1200,830 1230,830 1230,300 1580,300 1580,270 
    1180,270 1180,230 1230,230 1230,200 1000,200 
    1000,120 960,120 960,200 900,200 900,120 760,120 
    760,200 560,200 560,160 530,160 530,120 500,120 500,200" 
    fill="#f9f9ff" 
    stroke="#6633FF" 
    stroke-width="1" 
    data-type="corridor"
    data-floor="1"/>
    <text x="540" y="215" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>

    <polygon id="buffet-1" 
        className={`buffet ${getHighlightClass('buffet-1')}`} 
        points="530,160 530,120 560,120 560,160" 
        fill="#FF6F61" 
        stroke="black" 
        stroke-width="1" 
        data-type="buffet"
        data-floor="1"/>
    <image 
        href={buffetIcon} 
        x="530" y="120" 
        width="30" height="30" 
        data-associated-with="buffet-1"/>

    <polygon 
        id="dining-1" 
        className={`dining ${getHighlightClass('dining-1')}`} 
        points="1380,100 1380,270 1580,270 1580,100" 
        fill="#FF6F61" 
        stroke="black" 
        stroke-width="1" 
        data-type="dining"
        data-floor="1"/>
    <image 
        href={buffetIcon} 
        x="1460" y="170" 
        width="30" height="30" 
        data-associated-with="dining-1"/>

    <polygon 
        id="ladder-1"
        className={`ladder ${getHighlightClass('ladder-1')}`} 
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
        data-associated-with="ladder-1"/>    
        
    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`}  
        points="1060,300 1060,230 1140,230 1140,300" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <image 
        href={ladderIcon} 
        x="1080" y="250" 
        width="30" height="30" 
        data-associated-with="ladder-2"/>

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`} 
        points="450,640 450,600 520,600 520,640" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <image 
        href={ladderIcon} 
        x="470" y="605" 
        width="30" height="30" 
        data-associated-with="ladder-3"/>

    <polygon 
        id="mentoilet-1"
        className={`mentoilet ${getHighlightClass('mentoilet-1')}`}
        points="1130,370 1130,330 1200,330 1200,370" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="mentoilet"
        data-floor="1"/>
    <image 
        href={womentoiletIcon} 
        x="1150" y="335" 
        width="30" height="30" 
        data-associated-with="mentoilet-1"/>

    <polygon 
        id="womentoilet-1"
        className={`womentoilet ${getHighlightClass('womentoilet-1')}`} 
        points="550,380 550,300 620,300 620,380" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="womentoilet"
        data-floor="1"/>
    <image 
        href={womentoiletIcon} 
        x="570" y="330" 
        width="30" height="30" 
        data-associated-with="womentoilet-1"/>

    <polygon 
        id="ladder-4"
        className={`ladder ${getHighlightClass('ladder-4')}`}  
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
        data-associated-with="ladder-4"/>
{[
        { id: "room-138-1", points: "100,100 100,300 300,300 300,100", number: "138", x: 200, y: 210 },
        { id: "room-136-1", points: "300,230 300,300 470,300 470,230", number: "136", x: 390, y: 265 },
        { id: "room-139-1", points: "300,120 300,200 380,200 380,120", number: "139", x: 340, y: 160 },
        { id: "room-137-1", points: "380,120 380,200 460,200 460,120", number: "137", x: 420, y: 160 },
        { id: "room-135-1", points: "460,120 460,200 500,200 500,120", number: "135", x: 480, y: 160 },
        { id: "room-134-1", points: "560,120 560,200 600,200 600,120", number: "134", x: 580, y: 160 },
        { id: "room-133-1", points: "600,120 600,200 660,200 660,120", number: "133", x: 630, y: 160 },
        { id: "room-131-1", points: "660,120 660,200 760,200 760,120", number: "131", x: 700, y: 160 },
        { id: "room-130-1", points: "900,120 900,200 960,200 960,120", number: "130", x: 930, y: 160 },
        { id: "room-129-1", points: "1000,120 1000,200 1040,200 1040,120", number: "129", x: 1020, y: 160 },
        { id: "room-128-1", points: "1040,120 1040,200 1100,200 1100,120", number: "128", x: 1070, y: 160 },
        { id: "room-126-1", points: "1100,120 1100,200 1140,200 1140,120", number: "126", x: 1120, y: 160 },
        { id: "room-125-1", points: "1140,120 1140,200 1180,200 1180,160 1380,160 1380,120", number: "125", x: 1160, y: 160 },
        { id: "room-127-1", points: "1180,160 1180,200 1230,200 1230,160", number: "127", x: 1205, y: 180 },
        { id: "room-124-1", points: "1180,230 1180,270 1230,270 1230,230", number: "124", x: 1205, y: 250 },
        { id: "room-0-1", points: "1230,160 1230,270 1380,270 1380,160", number: "0", x: 0, y: 0 },
        { id: "room-0-0-1", points: "470,230 470,300 500,300 500,230", number: "0", x: 0, y: 0 },
        { id: "room-141-1", points: "450,300 450,520 520,520 520,300", number: "141", x: 485, y: 420 },
        { id: "room-143-1", points: "450,520 450,600 520,600 520,520", number: "143", x: 485, y: 560 },
        { id: "room-152-1", points: "450,640 450,700 520,700 520,640", number: "152", x: 485, y: 660 },
        { id: "room-140-1", points: "550,460 550,380 620,380 620,460", number: "140", x: 585, y: 420 },
        { id: "room-142-1", points: "550,540 550,460 620,460 620,540", number: "142", x: 585, y: 500 },
        { id: "room-144-1", points: "550,580 550,540 620,540 620,580", number: "144", x: 585, y: 560 },
        { id: "room-146-1", points: "550,680 550,580 620,580 620,680", number: "146", x: 585, y: 630 },
        { id: "room-148-1", points: "550,720 550,680 620,680 620,720", number: "148", x: 585, y: 700 },
        { id: "room-118-1", points: "1130,440 1130,370 1200,370 1200,440", number: "118", x: 1165, y: 405 },
        { id: "room-116-1", points: "1130,490 1130,440 1200,440 1200,490", number: "116", x: 1165, y: 465 },
        { id: "room-114-1", points: "1130,540 1130,490 1200,490 1200,540", number: "114", x: 1165, y: 515 },
        { id: "room-112-1", points: "1130,580 1130,540 1200,540 1200,580", number: "112", x: 1165, y: 560 },
        { id: "room-110-1", points: "1130,620 1130,580 1200,580 1200,620", number: "110", x: 1165, y: 600 },
        { id: "room-106-1", points: "1130,670 1130,620 1200,620 1200,670", number: "106", x: 1165, y: 645 },
        { id: "room-104-1", points: "1130,740 1130,670 1200,670 1200,740", number: "104", x: 1165, y: 705 },
        { id: "room-102-1", points: "1130,830 1130,780 1200,780 1200,830", number: "102", x: 1165, y: 805 },
        { id: "room-101-1", points: "1230,830 1230,780 1300,780 1300,830", number: "101", x: 1265, y: 805 },
        { id: "room-103-1", points: "1230,780 1230,740 1300,740 1300,780", number: "103", x: 1265, y: 760 },
        { id: "room-105-1", points: "1230,710 1230,670 1300,670 1300,710", number: "105", x: 1265, y: 690 },
        { id: "room-0-0-0-1", points: "1230,740 1230,710 1300,710 1300,740", number: "0", x: 0, y: 0 },
        { id: "room-109-1", points: "1230,670 1230,620 1300,620 1300,670", number: "109", x: 1265, y: 645 },
        { id: "room-111-1", points: "1230,580 1230,540 1300,540 1300,580", number: "111", x: 1265, y: 560 },
        { id: "room-113-1", points: "1230,540 1230,440 1300,440 1300,540", number: "113", x: 1265, y: 490 },
        { id: "room-119-1", points: "1230,420 1230,300 1300,300 1300,350 1270,350 1270,420", number: "119", x: 1265, y: 330 },
        { id: "room-117-1", points: "1300,350 1270,350 1270,390 1300,390", number: "117", x: 1285, y: 370 },
        { id: "room-115-1", points: "1300,390 1270,390 1270,420 1230,420 1230,440 1300,440", number: "115", x: 1285, y: 410 },

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
        { id: "door-1-1", points: "380,230 400,230" },
        { id: "door-2-1", points: "300,150 300,170" },
        { id: "door-3-1", points: "300,205 300,225" },
        { id: "door-4-1", points: "300,250 300,270" },
        { id: "door-5-1", points: "420,200 440,200" },
        { id: "door-6-1", points: "470,200 490,200" },
        { id: "door-7-1", points: "570,200 590,200" },
        { id: "door-8-1", points: "620,200 640,200" },
        { id: "door-9-1", points: "1010,200 1030,200" },
        { id: "door-10-1", points: "1080,200 1100,200" },
        { id: "door-11-1", points: "1110,200 1130,200" },
        { id: "door-12-1", points: "1150,200 1170,200" },
        { id: "door-13-1", points: "1230,270 1260,270" },
        { id: "door-14-1", points: "1450,270 1480,270" },
        { id: "door-15-1", points: "520,320 520,340" },
        { id: "door-16-1", points: "520,480 520,500" },
        { id: "door-17-1", points: "520,580 520,600" },
        { id: "door-18-1", points: "580,460 600,460" },
        { id: "door-19-1", points: "550,510 550,530" },
        { id: "door-20-1", points: "550,640 550,660" },
        { id: "door-21-1", points: "550,690 550,710" },
        { id: "door-22-1", points: "1200,395 1200,415" },
        { id: "door-23-1", points: "1200,455 1200,475" },
        { id: "door-24-1", points: "1140,490 1160,490" },
        { id: "door-25-1", points: "1200,550 1200,570" },
        { id: "door-26-1", points: "1200,590 1200,610" },
        { id: "door-27-1", points: "1200,635 1200,655" },
        { id: "door-28-1", points: "1200,680 1200,700" },
        { id: "door-29-1", points: "1200,795 1200,815" },
        { id: "door-30-1", points: "1240,780 1260,780" },
        { id: "door-31-1", points: "1230,750 1230,770" },
        { id: "door-32-1", points: "1230,635 1230,655" },
        { id: "door-33-1", points: "1230,550 1230,570" },
        { id: "door-34-1", points: "1230,530 1230,510" },
        { id: "door-35-1", points: "1230,400 1230,380" },
        { id: "door-36-1", points: "1270,360 1270,380" },
        { id: "door-37-1", points: "1240,420 1260,420" },
        { id: "door-38-1", points: "470,700 490,700" },

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
        1080,300 660,300 620,300 620,830 
        450,830 450,300 100,300" 
        fill="none" stroke="black" stroke-width="2" />
        </svg>
    );
};