import { GiStairs } from 'react-icons/gi';
import { GrRestroomWomen } from 'react-icons/gr';
import SvgIcon from '../../components/SvgIcon';


interface FirstBuildingThirdFloorProops {
    onBackClick: () => void; // Функция для возврата к общей карте
    onRoomClick: (roomId: string, roomType?: string) => void;
    highlightedRooms?: string[];
    routePath?: string;
  }

  export const FirstBuildingThirdFloor: React.FC<FirstBuildingThirdFloorProops> = ({ onBackClick, onRoomClick = () => {},
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
        <>
        <rect width="100%" height="100%" fill="#f0f0f0" />

    <polygon
        id="corridor-1"
        className={`corridor ${getHighlightClass('corridor-1')}`}
        points="500,120 500,300 520,300 520,830 550,830 
        550,300 590,300 590,230 1160,230 1160,300 1200,300 
        1200,830 1230,830 1230,300 1300,300 1300,230 1380,230 
        1380,200 580,200 580,120" 
        fill="#f9f9ff" 
        stroke="#6633FF" 
        stroke-width="1" 
        data-type="corridor"
        data-floor="1"/>
    <text x="540" y="215" font-family="'Roboto', sans-serif"
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
        id="womentoilet-1"
        className={`womentoilet ${getHighlightClass('womentoilet-1')}`} 
        points="1130,380 1130,340 1200,340 1200,380" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="womentoilet"
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
        id="mentoilet-1"
        className={`mentoilet ${getHighlightClass('mentoilet-1')}`} 
        points="550,380 550,340 620,340 620,380" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="mentoilet"
        data-floor="1"/>
    <SvgIcon x={570} y={345} Icon={ GrRestroomWomen } />

    <polygon         
        id="ladder-4"
        className={`ladder ${getHighlightClass('ladder-4')}`}
        points="450,640 450,600 520,600 520,640" 
        fill="rgb(82, 87, 126)" 
        stroke="black" 
        stroke-width="1" 
        data-type="ladder"
        data-floor="1"/>
    <SvgIcon x={470} y={605} Icon={ GiStairs } />
{[
        { id: "room-0-3", points: "100,100 100,300 300,300 300,100", number: "0", x: 0, y: 0 },
        { id: "room-341-3", points: "300,120 300,300 500,300 500,120", number: "341", x: 400, y: 210 },
        { id: "room-339-3", points: "580,120 580,200 620,200 620,120", number: "339", x: 600, y: 160 },
        { id: "room-337-3", points: "620,120 620,200 670,200 670,120", number: "337", x: 645, y: 160 },
        { id: "room-335-3", points: "670,120 670,200 740,200 740,120", number: "335", x: 700, y: 160 },
        { id: "room-333-3", points: "740,120 740,200 790,200 790,120", number: "333", x: 765, y: 160 },
        { id: "room-3", points: "790,120 790,170 830,170 830,120", number: "0", x: 0, y: 0 },
        { id: "room-0-0-3", points: "790,170 790,200 830,200 830,170", number: "0", x: 0, y: 0 },
        { id: "room-6-3", points: "830,120 830,200 890,200 890,120", number: "6", x: 850, y: 150 },
        { id: "room-7-3", points: "890,120 890,200 930,200 930,120", number: "7", x: 910, y: 150 },
        { id: "room-327-3", points: "930,120 930,200 970,200 970,120", number: "327", x: 950, y: 160 },
        { id: "room-325-3", points: "970,120 970,200 1020,200 1020,120", number: "325", x: 995, y: 160 },
        { id: "room-323-3", points: "1020,120 1020,200 1060,200 1060,120", number: "323", x: 1040, y: 160 },
        { id: "room-321-3", points: "1060,120 1060,200 1110,200 1110,120", number: "321", x: 1085, y: 160 },
        { id: "room-319-3", points: "1110,120 1110,200 1150,200 1150,120", number: "319", x: 1130, y: 160 },
        { id: "room-315-3", points: "1150,120 1150,200 1190,200 1190,120", number: "315", x: 1170, y: 160 },
        { id: "room-317-3", points: "1190,120 1190,200 1230,200 1230,120", number: "317", x: 1210, y: 160 },
        { id: "room-313-3", points: "1230,120 1230,300 1380,300 1380,120", number: "313", x: 1300, y: 210 },
        { id: "room-0-0-0-3", points: "1380,100 1380,300 1580,300 1580,100", number: "0", x: 0, y: 0 },
        { id: "room-311-3", points: "1230,350 1230,300 1300,300 1300,350", number: "311", x: 1265, y: 330 },
        { id: "room-309-3", points: "1230,500 1230,350 1300,350 1300,500", number: "309", x: 1265, y: 425 },
        { id: "room-307-3", points: "1230,580 1230,500 1300,500 1300,580", number: "307", x: 1265, y: 540 },
        { id: "room-305-3", points: "1230,660 1230,620 1300,620 1300,660", number: "305", x: 1265, y: 640 },
        { id: "room-303-3", points: "1230,740 1230,660 1300,660 1300,740", number: "303", x: 1265, y: 700 },
        { id: "room-301-3", points: "1230,830 1230,740 1300,740 1300,830", number: "301", x: 1265, y: 790 },
        { id: "room0-3", points: "1130,830 1130,810 1200,810 1200,830", number: "0", x: 0, y: 0 },
        { id: "room-302-3", points: "1130,810 1130,730 1200,730 1200,810", number: "302", x: 1165, y: 770 },
        { id: "room-304-3", points: "1130,730 1130,680 1200,680 1200,730", number: "304", x: 1165, y: 705 },
        { id: "room-306-3", points: "1130,680 1130,630 1200,630 1200,680", number: "306", x: 1165, y: 655 },
        { id: "room-308-3", points: "1130,630 1130,590 1200,590 1200,630", number: "308", x: 1165, y: 610 },
        { id: "room-310-3", points: "1130,590 1130,540 1200,540 1200,590", number: "310", x: 1165, y: 565 },
        { id: "room-312-3", points: "1130,540 1130,500 1200,500 1200,540", number: "312", x: 1165, y: 520 },
        { id: "room-314-3", points: "1130,500 1130,420 1200,420 1200,500", number: "314", x: 1165, y: 460 },
        { id: "room-316-3", points: "1130,420 1130,380 1200,380 1200,420", number: "316", x: 1165, y: 400 },
        { id: "room-318-3", points: "1130,340 1130,300 1200,300 1200,340", number: "318", x: 1165, y: 320 },
        { id: "room-336-3", points: "550,340 550,300 620,300 620,340", number: "336", x: 585, y: 320 },
        { id: "room-338-3", points: "550,480 550,380 620,380 620,480", number: "338", x: 585, y: 430 },
        { id: "room-340-3", points: "550,600 550,480 620,480 620,600", number: "340", x: 585, y: 540 },
        { id: "room-342-3", points: "550,640 550,600 620,600 620,640", number: "342", x: 585, y: 620 },
        { id: "room-344-3", points: "550,720 550,640 620,640 620,720", number: "344", x: 585, y: 680 },
        { id: "room-346-3", points: "550,770 550,720 620,720 620,770", number: "346", x: 585, y: 750 },
        { id: "room-348-3", points: "550,830 550,770 620,770 620,830", number: "348", x: 585, y: 800 },
        { id: "room-352-3", points: "450,830 450,755 520,755 520,830", number: "352", x: 480, y: 795 },
        { id: "room-353-3", points: "450,755 450,680 520,680 520,755", number: "353", x: 480, y: 720 },
        { id: "room-351-3", points: "450,680 450,640 520,640 520,680", number: "351", x: 480, y: 660 },
        { id: "room-349-3", points: "450,520 450,600 520,600 520,520", number: "349", x: 480, y: 560 },
        { id: "room-347-3", points: "450,470 450,520 520,520 520,470", number: "347", x: 480, y: 495 },
        { id: "room-345-3", points: "450,420 450,470 520,470 520,420", number: "345", x: 480, y: 445 },
        { id: "room-343-3", points: "450,300 450,380 520,380 520,300", number: "343", x: 480, y: 340 },
        { id: "room-334-3", points: "660,300 660,230 750,230 750,300", number: "334", x: 705, y: 265 },
        { id: "room-332-3", points: "750,300 750,230 790,230 790,300", number: "332", x: 770, y: 265 },
        { id: "room-330-3", points: "790,300 790,230 830,230 830,300", number: "330", x: 810, y: 265 },
        { id: "room-0-0-0-0-3", points: "450,380 450,420 520,420 520,380", number: "0", x: 0, y: 0 },
        { id: "room-328-3", points: "830,300 830,230 870,230 870,300", number: "328", x: 850, y: 265 },
        { id: "room-326-3", points: "870,300 870,230 910,230 910,300", number: "326", x: 890, y: 265 },
        { id: "room-324-3", points: "910,300 910,230 950,230 950,300", number: "324", x: 930, y: 265 },
        { id: "room-322-3", points: "990,300 990,230 1080,230 1080,300", number: "322", x: 1030, y: 265 },
        { id: "room-0-0-0-0-0-3", points: "950,300 950,230 990,230 990,300", number: "0", x: 0, y: 0 },

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
        { id: "door-1-3", points: "500,130 500,150" },
        { id: "door-2-3", points: "500,270 500,290" },
        { id: "door-3-3", points: "590,200 610,200" },
        { id: "door-4-3", points: "635,200 655,200" },
        { id: "door-5-3", points: "700,200 720,200" },
        { id: "door-6-3", points: "750,200 770,200" },
        { id: "door-7-3", points: "830,190 830,180" },
        { id: "door-8-3", points: "830,160 830,150" },
        { id: "door-9-3", points: "850,200 870,200" },
        { id: "door-10-3", points: "930,190 930,170" },
        { id: "door-11-3", points: "940,200 960,200" },
        { id: "door-12-3", points: "1020,150 1020,170" },
        { id: "door-13-3", points: "1030,200 1050,200" },
        { id: "door-14-3", points: "1075,200 1095,200" },
        { id: "door-15-3", points: "1120,200 1140,200" },
        { id: "door-16-3", points: "1160,200 1180,200" },
        { id: "door-17-3", points: "1200,200 1220,200" },
        { id: "door-18-3", points: "1230,210 1230,225" },
        { id: "door-19-3", points: "1230,275 1230,290" },
        { id: "door-20-3", points: "1230,315 1230,335" },
        { id: "door-21-3", points: "1230,420 1230,440" },
        { id: "door-22-3", points: "1230,520 1230,540" },
        { id: "door-23-3", points: "1230,630 1230,650" },
        { id: "door-24-3", points: "1230,700 1230,720" },
        { id: "door-25-3", points: "1230,790 1230,810" },
        { id: "door-26-3", points: "1155,810 1175,810" },
        { id: "door-27-3", points: "1200,740 1200,760" },
        { id: "door-28-3", points: "1200,690 1200,710" },
        { id: "door-29-3", points: "1200,645 1200,665" },
        { id: "door-30-3", points: "1200,600 1200,620" },
        { id: "door-31-3", points: "1200,555 1200,575" },
        { id: "door-32-3", points: "1200,510 1200,530" },
        { id: "door-33-3", points: "1200,430 1200,450" },
        { id: "door-34-3", points: "1200,390 1200,410" },
        { id: "door-35-3", points: "1200,310 1200,330" },
        { id: "door-36-3", points: "550,310 550,330" },
        { id: "door-37-3", points: "550,390 550,410" },
        { id: "door-38-3", points: "550,570 550,590" },
        { id: "door-39-3", points: "550,610 550,630" },
        { id: "door-40-3", points: "550,690 550,710" },
        { id: "door-41-3", points: "550,735 550,755" },
        { id: "door-42-3", points: "550,800 550,820" },
        { id: "door-43-3", points: "520,790 520,810" },
        { id: "door-44-3", points: "520,700 520,720" },
        { id: "door-45-3", points: "520,650 520,670" },
        { id: "door-46-3", points: "520,560 520,580" },
        { id: "door-47-3", points: "520,485 520,505" },
        { id: "door-48-3", points: "520,435 520,455" },
        { id: "door-49-3", points: "520,390 520,410" },
        { id: "door-50-3", points: "490,380 510,380" },
        { id: "door-51-3", points: "700,230 720,230" },
        { id: "door-52-3", points: "750,240 750,260" },
        { id: "door-53-3", points: "800,230 820,230" },
        { id: "door-54-3", points: "840,230 860,230" },
        { id: "door-55-3", points: "880,230 900,230" },
        { id: "door-56-3", points: "920,230 940,230" },
        { id: "door-57-3", points: "950,250 950,270" },
        { id: "door-58-3", points: "1030,230 1050,230" },

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
            </>
    );
};