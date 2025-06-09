import { BiDrink } from 'react-icons/bi';
import { GiStairs } from 'react-icons/gi';
import { GrRestroomWomen } from 'react-icons/gr';
import SvgIcon from '../../components/SvgIcon';


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
        points="120,1200 120,1250 640,1250 640,1300 740,1300 740,1250 1560,1250 1560,1270 1670,1270 1670,910 1680,910 1680,380 1640,380 1640,860 
        1620,860 1620,1180 1560,1180 1560,1200 820,1200 820,1150 560,1150 560,1200" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        strokeWidth="1"
        data-type="corridor"
        data-floor="1" />
    <text x="200" y="1230" font-family="'Roboto', sans-serif"
    fill="black" font-size="18" text-anchor="middle" 
    alignment-baseline="middle">Коридор</text>
        

{[
        { id: "room-1-1", points: "50,1150 50,1200 100,1200 100,1150", number: "", x: 70, y: 1170 },
        { id: "room-2-1", points: "100,1150 100,1200 200,1200 200,1150", number: "", x: 150, y: 1170 },
        { id: "room-3-1", points: "200,1150 200,1200 300,1200 300,1150", number: "", x: 250, y: 1170 },
        { id: "room-4-1", points: "300,1150 300,1200 400,1200 400,1150", number: "107", x: 350, y: 1170 },
        { id: "room-5-1", points: "400,1150 400,1200 440,1200 440,1150", number: "109", x: 420, y: 1170 },
        { id: "room-6-1", points: "440,1150 440,1200 500,1200 500,1150", number: "111", x: 470, y: 1170 },
        { id: "room-7-1", points: "500,1150 500,1200 560,1200 560,1150", number: "113", x: 530, y: 1170 },
        { id: "room-8-1", points: "560,1050 560,1150 600,1150 600,1050", number: "115", x: 580, y: 1100 },
        { id: "room-9-1", points: "600,1050 600,1150 660,1150 660,1050", number: "119", x: 630, y: 1100 },
        { id: "room-10-1", points: "720,1050 720,1150 820,1150 820,1050", number: "121", x: 770, y: 1100 },
        { id: "room-11-1", points: "820,1150 820,1200 920,1200 920,1150", number: "125", x: 870, y: 1170 },
        { id: "room-12-1", points: "970,1150 970,1200 1010,1200 1010,1150", number: "129", x: 990, y: 1170 },
        { id: "room-13-1", points: "1010,1150 1010,1200 1060,1200 1060,1150", number: "127", x: 1030, y: 1170 },
        { id: "room-14-1", points: "1060,1150 1060,1200 1110,1200 1110,1150", number: "123", x: 1080, y: 1170 },
        { id: "room-15-1", points: "1110,1150 1110,1200 1160,1200 1160,1150", number: "131", x: 1130, y: 1170 },
        { id: "room-16-1", points: "1160,1150 1160,1200 1210,1200 1210,1150", number: "137", x: 1180, y: 1170 },
        { id: "room-17-1", points: "1210,1150 1210,1200 1260,1200 1260,1150", number: "135", x: 1230, y: 1170 },
        { id: "room-18-1", points: "1260,1150 1260,1200 1310,1200 1310,1150", number: "", x: 1700, y: 1170 },
        { id: "room-19-1", points: "1310,1150 1310,1200 1370,1200 1370,1150", number: "139", x: 1340, y: 1170 },
        { id: "room-20-1", points: "1370,1150 1370,1200 1420,1200 1420,1150", number: "141", x: 1390, y: 1170 },
        { id: "room-21-1", points: "1420,1150 1420,1200 1470,1200 1470,1150", number: "143", x: 1440, y: 1170 },
        { id: "room-22-1", points: "1470,1150 1470,1200 1510,1200 1510,1150", number: "147", x: 1490, y: 1170 },

        { id: "room-24-1", points: "120,1250 120,1300 200,1300 200,1250", number: "", x: 430, y: 1270 },

        { id: "room-25-1", points: "300,1250 300,1300 340,1300 340,1250", number: "106", x: 320, y: 1270 },
        { id: "room-26-1", points: "340,1250 340,1300 400,1300 400,1250", number: "108", x: 370, y: 1270 },
        { id: "room-27-1", points: "400,1250 400,1300 440,1300 440,1250", number: "110", x: 420, y: 1270 },
        { id: "room-28-1", points: "440,1250 440,1300 480,1300 480,1250", number: "112", x: 460, y: 1270 },
        { id: "room-29-1", points: "480,1250 480,1300 560,1300 560,1250", number: "114", x: 520, y: 1270 },
        { id: "room-34-1", points: "600,1210 600,1300 640,1300 640,1210", number: "116", x: 620, y: 1270 },
        { id: "room-35-1", points: "740,1210 740,1300 780,1300 780,1210", number: "120", x: 760, y: 1270 },
        { id: "room-36-1", points: "820,1250 820,1300 880,1300 880,1250", number: "122", x: 850, y: 1270 },
        { id: "room-37-1", points: "880,1250 880,1300 940,1300 940,1250", number: "124", x: 910, y: 1270 },
        { id: "room-38-1", points: "940,1250 940,1300 970,1300 970,1250", number: "126", x: 955, y: 1270 },
        { id: "room-39-1", points: "970,1250 970,1300 1060,1300 1060,1250", number: "128", x: 1010, y: 1270 },
        { id: "room-40-1", points: "1060,1250 1060,1300 1160,1300 1160,1250", number: "130", x: 1100, y: 1270 },
        { id: "room-41-1", points: "1160,1250 1160,1300 1260,1300 1260,1250", number: "134", x: 1200, y: 1270 },
        { id: "room-42-1", points: "1260,1250 1260,1300 1300,1300 1300,1250", number: "132", x: 1280, y: 1270 },
        { id: "room-43-1", points: "1300,1250 1300,1300 1370,1300 1370,1250", number: "136", x: 1340, y: 1270 },
        { id: "room-44-1", points: "1370,1250 1370,1300 1440,1300 1440,1250", number: "140", x: 1400, y: 1270 },
        { id: "room-45-1", points: "1440,1250 1440,1300 1480,1300 1480,1250", number: "142", x: 1460, y: 1270 },
        { id: "room-46-1", points: "1480,1250 1480,1300 1560,1300 1560,1250", number: "144", x: 1510, y: 1270 },

        { id: "room-47-1", points: "1560,1270 1560,1450 1760,1450 1760,1270", number: "87", x: 1660, y: 1350 },
      
        { id: "room-49-1", points: "1560,1080 1560,1180 1620,1180 1620,1080", number: "155", x: 1590, y: 1100 },
        { id: "room-50-1", points: "1560,1000 1560,1080 1620,1080 1620,1000", number: "157", x: 1590, y: 1040 },
        { id: "room-51-1", points: "1540,900 1540,1000 1620,1000 1620,900", number: "46", x: 1590, y: 950 },
        { id: "room-52-1", points: "1540,860 1540,900 1620,900 1620,860", number: "46а", x: 1590, y: 880 },
        { id: "room-53-1", points: "1560,820 1560,860 1640,860 1640,820", number: "", x: 1590, y: 1040 },
        { id: "room-54-1", points: "1560,780 1560,820 1640,820 1640,780", number: "103", x: 1590, y: 800 },
        { id: "room-55-1", points: "1560,660 1560,780 1640,780 1640,660", number: "107", x: 1590, y: 720 },
        { id: "room-56-1", points: "1560,610 1560,660 1640,660 1640,610", number: "", x: 1590, y: 720 },
        { id: "room-57-1", points: "1560,560 1560,610 1640,610 1640,560", number: "", x: 1590, y: 720 },
        { id: "room-58-1", points: "1560,420 1560,520 1640,520 1640,420", number: "", x: 1590, y: 720 },
        { id: "room-59-1", points: "1560,380 1560,420 1640,420 1640,380", number: "109", x: 1590, y: 400 },

        { id: "room-60-1", points: "1600,340 1600,380 1720,380 1720,340", number: "111", x: 1650, y: 355 },

        { id: "room-61-1", points: "1680,380 1680,420 1760,420 1760,380", number: "134", x: 1720, y: 400 },
        { id: "room-62-1", points: "1680,380 1680,420 1760,420 1760,380", number: "134", x: 1720, y: 400 },
        { id: "room-63-1", points: "1680,420 1680,520 1760,520 1760,420", number: "134а", x: 1720, y: 460 },
        { id: "room-63-1", points: "1680,520 1680,570 1760,570 1760,520", number: "108", x: 1720, y: 540 },
        { id: "room-64-1", points: "1680,570 1680,620 1760,620 1760,570", number: "", x: 1720, y: 610 },
        { id: "room-65-1", points: "1680,620 1680,740 1760,740 1760,620", number: "106", x: 1720, y: 650 },
        
        { id: "room-67-1", points: "1680,740 1680,800 1760,800 1760,740", number: "102", x: 1720, y: 760 },
        { id: "room-68-1", points: "1680,800 1680,860 1760,860 1760,800", number: "", x: 1720, y: 820 },
        { id: "room-69-1", points: "1670,910 1670,990 1760,990 1760,910", number: "", x: 1720, y: 930 },
        { id: "room-70-1", points: "1670,990 1670,1060 1760,1060 1760,990", number: "48", x: 1720, y: 1010 },

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
    <SvgIcon x={670} y={1080} Icon={ GiStairs } />

    <polygon 
        id="mentoilet-1"
        className={`dining ${getHighlightClass('mentoilet-1')}`}
        points="560,1250 560,1300 600,1300 600,1250" 
        fill=" #F4C2C2" 
        stroke="black" 
        stroke-width="2" 
        data-type="mentoilet"
        data-floor="1" />
    <SvgIcon x={565} y={1260} Icon={ GrRestroomWomen } />

    <polygon 
        id="mentoilet-2"
        className={`ladder ${getHighlightClass('mentoilet-2')}`}
        points="780,1250 780,1300 820,1300 820,1250" 
        fill=" #F4C2C2" 
        stroke="black" 
        stroke-width="2" 
        data-type="mentoilet"
        data-floor="1" />
    <SvgIcon x={785} y={1260} Icon={ GrRestroomWomen } />

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`}
        points="920,1150 920,1200 970,1200 970,1150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={930} y={1160} Icon={ GiStairs } />

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`}
        points="1260,1150 1260,1200 1310,1200 1310,1150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={1270} y={1160} Icon={ GiStairs } />

<polygon 
        id="ladder-4"
        className={`ladder ${getHighlightClass('ladder-4')}`}
        points="1510,1150 1510,1200 1560,1200 1560,1150" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={1520} y={1160} Icon={ GiStairs } />

    <polygon 
        id="dining-1"
        className={`ladder ${getHighlightClass('dining-1')}`} 
        points="200,1250 200,1300 300,1300 300,1250" 
        fill="#FF6F61" 
        stroke="black" 
        stroke-width="1" 
        data-type="dining"
        data-floor="1"/>
    <SvgIcon x={230} y={1260} Icon={ BiDrink } />

    <polygon 
        id="mentoilet-3"
        className={`ladder ${getHighlightClass('mentoilet-3')}`}
        points="1560,520 1560,560 1640,560 1640,520" 
        fill=" #F4C2C2" 
        stroke="black" 
        stroke-width="2" 
        data-type="mentoilet"
        data-floor="1" />
    <SvgIcon x={1590} y={520} Icon={ GrRestroomWomen } />

<polygon 
        id="ladder-5"
        className={`ladder ${getHighlightClass('ladder-5')}`}
        points="1680,860 1680,910 1760,910 1760,860" 
        fill="#663366" 
        stroke="black" 
        strokeWidth="2"
        data-type="ladder"
        data-floor="1" />
    <SvgIcon x={1705} y={870} Icon={ GiStairs } />

    <polygon 
        id="dining-2"
        className={`ladder ${getHighlightClass('dining-2')}`} 
        points="1670,1060 1670,1270 1760,1270 1760,1060" 
        fill="#FF6F61" 
        stroke="black" 
        stroke-width="1" 
        data-type="dining"
        data-floor="1"/>
    <SvgIcon x={1700} y={1160} Icon={ BiDrink } />

<polygon
        points="50,1150 50,1200 120,1200 120,1300 1560,1300 1560,1450 1760,1450 1760,380 1720,380 1720,340 1600,340 1600,380 1560,380 
        1560,860 1540,860 1540,1000 1560,1000 1560,1150 820,1150 820,1050 560,1050 560,1150" 
        fill="none" stroke="black" stroke-width="4" />
 
        </svg>
    );
};