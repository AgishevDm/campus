import { GiStairs } from 'react-icons/gi';
import SvgIcon from '../../components/SvgIcon';

interface TwelfthBuildingThirdFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const TwelfthBuildingThirdFloor: React.FC<TwelfthBuildingThirdFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        points="50,200 840,200 840,170 960,170 960,200 
        1200,200 1200,170 1250,170 1250,130 1300,130 
        1300,280 1220,280 1220,250 960,250 960,360 
        840,360 840,250 470,250 470,360 290,360 290,250 
        50,250" 
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
        points="430,100 430,200 480,200 480,100" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={440} y={140} Icon={ GiStairs } />

    <polygon 
        id="ladder-2"
        className={`ladder ${getHighlightClass('ladder-2')}`} 
        points="1000,100 1000,200 1050,200 1050,100" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={1010} y={140} Icon={ GiStairs } />

    <polygon 
        id="ladder-3"
        className={`ladder ${getHighlightClass('ladder-3')}`} 
        points="50,250 50,320 100,320 100,250" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={60} y={270} Icon={ GiStairs } />

{[
        { id: "room-302-3", points: "200,100 200,200 280,200 280,100", number: "302", x: 240, y: 150 },
        { id: "room-304-3", points: "280,100 280,200 430,200 430,100", number: "304", x: 330, y: 150 },
        { id: "room-306-3", points: "480,100 480,200 580,200 580,100", number: "306", x: 530, y: 150 },
        { id: "room-308-3", points: "580,100 580,200 680,200 680,100", number: "308", x: 630, y: 150 },
        { id: "room-310-3", points: "680,100 680,200 790,200 790,100", number: "310", x: 730, y: 150 },
        { id: "room-312-3", points: "790,100 790,200 840,200 840,100", number: "312", x: 815, y: 150 },
        { id: "room-314-3", points: "840,70 840,170 960,170 960,70", number: "314", x: 900, y: 120 },
        { id: "room-316-3", points: "960,100 960,200 1000,200 1000,100", number: "316", x: 980, y: 150 },
        { id: "room-318-3", points: "1050,130 1050,200 1120,200 1120,130", number: "318", x: 1080, y: 170 },
        { id: "room-320-3", points: "1120,130 1120,200 1200,200 1200,130", number: "320", x: 1150, y: 170 },
        { id: "room-322-3", points: "1200,130 1200,190 1300,190 1300,130", number: "322", x: 1240, y: 170 },
        { id: "room-324-3", points: "1300,130 1300,250 1450,250 1450,130", number: "324", x: 1370, y: 190 },
        { id: "room-0-3", points: "100,250 100,320 150,320 150,250", number: "", x: 0, y: 0 },
        { id: "room-301-3", points: "150,250 150,320 200,320 200,250", number: "301", x: 175, y: 290 },
        { id: "room-303-3", points: "200,250 200,350 250,350 250,250", number: "303", x: 225, y: 300 },
        { id: "room-305-3", points: "250,250 250,350 290,350 290,250", number: "305", x: 270, y: 300 },
        { id: "room-0-0-3", points: "290,250 290,360 330,360 330,250", number: "", x: 0, y: 0 },
        { id: "room-307-3", points: "330,250 330,360 470,360 470,250", number: "307", x: 400, y: 300 },
        { id: "room-309-3", points: "470,250 470,350 580,350 580,250", number: "309", x: 520, y: 300 },
        { id: "room-311-3", points: "580,250 580,350 680,350 680,250", number: "311", x: 620, y: 300 },
        { id: "room-313-3", points: "680,250 680,350 730,350 730,250", number: "313", x: 705, y: 300 },
        { id: "room-315-3", points: "730,250 730,350 780,350 780,250", number: "315", x: 750, y: 300 },
        { id: "room-00-3", points: "780,250 780,350 840,350 840,250", number: "", x: 0, y: 0 },
        { id: "room-000-3", points: "840,250 840,360 960,360 960,250", number: "Читальный зал", x: 900, y: 300 },
        { id: "room-0000-3", points: "960,250 960,330 1000,330 1000,250", number: "", x: 0, y: 0 },
        { id: "room-00000-3", points: "1000,300 1000,330 1060,330 1060,300", number: "", x: 0, y: 0 },
        { id: "room-000000-3", points: "1000,250 1000,300 1030,300 1030,250", number: "", x: 0, y: 0 },
        { id: "room-317-3", points: "1060,250 1060,310 1120,310 1120,250", number: "317", x: 1090, y: 290 },
        { id: "room-319-3", points: "1120,250 1120,310 1220,310 1220,250", number: "319", x: 1170, y: 290 },
        { id: "room-321-3", points: "1220,280 1220,330 1300,330 1300,280", number: "321", x: 1260, y: 310 },
        { id: "room-323-3", points: "1300,250 1300,360 1450,360 1450,250", number: "323", x: 1375, y: 300 },

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
        { id: "door-1-3", points: "230,200 250,200" },
        { id: "door-2-3", points: "300,200 320,200" },
        { id: "door-3-3", points: "395,200 415,200" },
        { id: "door-4-3", points: "540,200 560,200" },
        { id: "door-5-3", points: "640,200 660,200" },
        { id: "door-6-3", points: "750,200 770,200" },
        { id: "door-7-3", points: "805,200 825,200" },
        { id: "door-8-3", points: "850,170 870,170" },
        { id: "door-9-3", points: "920,170 940,170" },
        { id: "door-10-3", points: "970,200 990,200" },
        { id: "door-11-3", points: "1070,200 1090,200" },
        { id: "door-12-3", points: "1160,200 1180,200" },
        { id: "door-13-3", points: "1260,190 1280,190" },
        { id: "door-14-3", points: "1300,200 1300,220" },
        { id: "door-15-3", points: "115,250 135,250" },
        { id: "door-16-3", points: "165,250 185,250" },
        { id: "door-17-3", points: "215,250 235,250" },
        { id: "door-18-3", points: "260,250 280,250" },
        { id: "door-19-3", points: "330,260 330,280" },
        { id: "door-20-3", points: "440,250 460,250" },
        { id: "door-21-3", points: "510,250 530,250" },
        { id: "door-22-3", points: "620,250 640,250" },
        { id: "door-23-3", points: "695,250 715,250" },
        { id: "door-24-3", points: "750,250 770,250" },
        { id: "door-25-3", points: "780,290 780,310" },
        { id: "door-26-3", points: "860,250 880,250" },
        { id: "door-27-3", points: "970,250 990,250" },
        { id: "door-28-3", points: "1010,250 1020,250" },
        { id: "door-29-3", points: "1000,310 1000,320" },
        { id: "door-30-3", points: "1030,260 1030,270" },
        { id: "door-31-3", points: "1080,250 1100,250" },
        { id: "door-32-3", points: "1180,250 1200,250" },
        { id: "door-33-3", points: "1230,280 1250,280" },
        { id: "door-34-3", points: "1300,270 1300,260" },

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
        points="50,200 50,320 200,320 200,350 290,350 
        290,360 470,360 470,350 840,350 840,360 960,360 
        960,330 1060,330 1060,310 1220,310 1220,330 1300,330 
        1300,360 1450,360 1450,130 1250,130 1250,130 1200,130 
        1200,130 1050,130 1050,100 960,100 960,70 840,70 840,100 
        200,100 200,200" 
        fill="none" stroke="black" stroke-width="2" />
            
        </svg>
    );
};