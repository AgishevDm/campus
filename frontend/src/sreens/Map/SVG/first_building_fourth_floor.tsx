import { GiStairs } from 'react-icons/gi';
import { GrRestroomWomen } from 'react-icons/gr';
import SvgIcon from './SvgIcon';

interface FirstBuildingFourthFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const FirstBuildingFourthFloor: React.FC<FirstBuildingFourthFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="520,230 520,780 450,780 450,830 620,830 
        620,810 550,810 550,300 580,300 580,230" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        stroke-width="1"
        data-type="corridor" 
        data-floor="1"/>

    <polygon
        id="corridor-2"
        className={`corridor ${getHighlightClass('corridor-2')}`}
        points="660,120 660,170 1080,170 1080,230 
        1130,230 1130,170 1190,170 1190,230 1160,230 
        1160,300 1200,300 1200,830 1230,830 1230,120" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        stroke-width="1" 
        data-type="corridor" 
        data-floor="1"/>
    <text x="710" y="145" font-family="'Roboto', sans-serif"
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
    <SvgIcon x={1100} y={250} Icon={ GiStairs } />

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`}  
        points="1230,620 1230,580 1300,580 1300,620" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder" 
        data-floor="1"/>
    <SvgIcon x={1250} y={585} Icon={ GiStairs } />

    <polygon 
        id="mentoilet-1"
        className={`mentoilet ${getHighlightClass('mentoilet-1')}`} 
        points="1130,340 1130,380 1200,380 1200,340" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="mentoilet" 
        data-floor="1"/>
    <SvgIcon x={1150} y={345} Icon={ GrRestroomWomen } />

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`}
        points="580,300 580,230 660,230 660,300" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder" 
        data-floor="1"/>
    <SvgIcon x={610} y={250} Icon={ GiStairs } />

    <polygon 
        id="ladder-4"
        className={`ladder ${getHighlightClass('ladder-4')}`} 
        points="450,600 450,560 520,560 520,600" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder" 
        data-floor="1"/>
    <SvgIcon x={470} y={565} Icon={ GiStairs } />

{[
        { id: "room-419-4", points: "520,120 520,230 660,230 660,120", number: "419", x: 590, y: 170 },
        { id: "room-0-4", points: "100,100 100,300 300,300 300,100", number: "0", x: 0, y: 0 },
        { id: "room-0-0-4", points: "300,120 300,300 520,300 520,120", number: "0", x: 0, y: 0 },
        { id: "room-424-4", points: "660,170 660,300 880,300 880,170", number: "424", x: 770, y: 240 },
        { id: "room-422-4", points: "880,170 880,300 1080,300 1080,170", number: "422", x: 980, y: 240 },
        { id: "room-0-0-0-4", points: "1380,100 1380,300 1580,300 1580,100", number: "0", x: 0, y: 0 },
        { id: "room-0-0-0-0-4", points: "1230,120 1230,300 1380,300 1380,120", number: "0", x: 0, y: 0 },
        { id: "room-415-4", points: "1230,300 1230,340 1300,340 1300,300", number: "415", x: 1265, y: 320 },
        { id: "room-413-4", points: "1230,340 1230,420 1300,420 1300,340", number: "413", x: 1265, y: 380 },
        { id: "room-411-4", points: "1230,420 1230,460 1300,460 1300,420", number: "411", x: 1265, y: 440 },
        { id: "room-409-4", points: "1230,460 1230,500 1300,500 1300,460", number: "409", x: 1265, y: 480 },
        { id: "room-407-4", points: "1230,500 1230,540 1300,540 1300,500", number: "407", x: 1265, y: 520 },
        { id: "room-405-4", points: "1230,540 1230,580 1300,580 1300,540", number: "405", x: 1265, y: 560 },
        { id: "room-417-4", points: "1130,170 1130,230 1190,230 1190,170", number: "417", x: 1160, y: 200 },
        { id: "room-403-4", points: "1230,620 1230,660 1300,660 1300,620", number: "403", x: 1265, y: 640 },
        { id: "room-401-4", points: "1230,660 1230,830 1300,830 1300,660", number: "401", x: 1265, y: 750 },
        { id: "room-404-4", points: "1130,770 1130,830 1200,830 1200,770", number: "404", x: 1165, y: 800 },
        { id: "room-402-4", points: "1130,730 1130,770 1200,770 1200,730", number: "402", x: 1165, y: 750 },
        { id: "room-405-4", points: "1130,660 1130,730 1200,730 1200,660", number: "405", x: 1165, y: 695 },
        { id: "room-408-4", points: "1130,620 1130,660 1200,660 1200,620", number: "408", x: 1165, y: 640 },
        { id: "room-410-4", points: "1130,580 1130,620 1200,620 1200,580", number: "410", x: 1165, y: 600 },
        { id: "room-412-4", points: "1130,540 1130,580 1200,580 1200,540", number: "412", x: 1165, y: 560 },
        { id: "room-416-4", points: "1130,500 1130,540 1200,540 1200,500", number: "416", x: 1165, y: 520 },
        { id: "room-414-4", points: "1130,420 1130,500 1200,500 1200,420", number: "414", x: 1165, y: 460 },
        { id: "room-418-4", points: "1130,380 1130,420 1200,420 1200,380", number: "418", x: 1165, y: 400 },
        { id: "room-420-4", points: "1130,300 1130,340 1200,340 1200,300", number: "420", x: 1165, y: 320 },
        { id: "room-421-4", points: "450,340 450,300 520,300 520,340", number: "421", x: 485, y: 320 },
        { id: "room-423-4", points: "450,380 450,340 520,340 520,380", number: "423", x: 485, y: 360 },
        { id: "room-425-4", points: "450,460 450,380 520,380 520,460", number: "425", x: 485, y: 420 },
        { id: "room-427-4", points: "450,560 450,460 520,460 520,560", number: "427", x: 485, y: 510 },
        { id: "room-431-4", points: "450,640 450,600 520,600 520,640", number: "431", x: 485, y: 620 },
        { id: "room-429-4", points: "450,680 450,640 520,640 520,680", number: "429", x: 485, y: 660 },
        { id: "room-435-4", points: "450,730 450,680 520,680 520,730", number: "435", x: 485, y: 705 },
        { id: "room-433-4", points: "450,780 450,730 520,730 520,780", number: "433", x: 485, y: 755 },
        { id: "room-4", points: "550,340 550,300 620,300 620,340", number: "0", x: 0, y: 0 },
        { id: "room-430-4", points: "550,380 550,340 620,340 620,380", number: "430", x: 585, y: 360 },
        { id: "room-432-4", points: "550,460 550,380 620,380 620,460", number: "432", x: 585, y: 420 },
        { id: "room-434-4", points: "550,520 550,460 620,460 620,520", number: "434", x: 585, y: 490 },
        { id: "room-436-4", points: "550,560 550,520 620,520 620,560", number: "436", x: 585, y: 540 },
        { id: "room-440-4", points: "550,610 550,560 620,560 620,610", number: "440", x: 585, y: 585 },
        { id: "room-438-4", points: "550,660 550,610 620,610 620,660", number: "438", x: 585, y: 635 },
        { id: "room-00-4", points: "550,710 550,660 620,660 620,710", number: "0", x: 0, y: 0 },
        { id: "room-448-4", points: "550,760 550,710 620,710 620,760", number: "448", x: 585, y: 735 },
        { id: "room-446-4", points: "550,810 550,760 620,760 620,810", number: "446", x: 585, y: 785 },

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

    <polygon
        points="100,100 300,100 300,120 1380,120 1380,100 
        1580,100 1580,300 1300,300 1300,830 1130,830 1130,300 
        1080,300 660,300 620,300 620,830 
        450,830 450,300 100,300" 
        fill="none" stroke="black" stroke-width="2" />
        </svg>
    );
};