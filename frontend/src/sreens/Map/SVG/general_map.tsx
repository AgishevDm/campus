interface GeneralMapProps {
      onPolygonClick: (buildingId: 'firstBuilding' | 'twelfthBuilding' | 'eighthBuilding') => void; // Функция для обработки клика на полигон
    }

    export const GeneralMap: React.FC<GeneralMapProps> = ({ onPolygonClick }) => {
    return(
    <>
            <rect width="100%" height="100%" fill="#f0f0f0" />

            <polygon  
                  points="100,590 320,590 320,160 330,160 330,590 
                  740,590 740,160 760,160 760,590 980,590 980,160 
                  1000,160 1000,590 1300,590 1320,560 1340,530 
                  1350,150 1370,150 1370,530 1350,610 920,610 920,900 900,900 
                  900,610 740,610 740,900 720,900 720,610 100,610" 
                  fill="rgb(252, 249, 249)" stroke="black" stroke-width="1" />

            <polygon id="Студклуб" 
                  className="Корпус" 
                  points="100,200 100,300 300,300 300,230 270,230 270,200" 
                  fill=" #E0E0E0" stroke="black" stroke-width="1" />
            <text x="200" y="250" font-family="'Roboto', sans-serif"
            fill="black" font-size="18" text-anchor="middle" 
            alignment-baseline="middle">Студклуб</text>

            <polygon id="6" 
                  className="Корпус" 
                  points="100,350 100,550 300,550 300,350" 
                  fill=" #E0E0E0" stroke="black" stroke-width="1" />
            <polygon
                  points="150,400 150,500 250,500 250,400" 
                  fill="#f0f0f0" stroke="black" stroke-width="1" />
            <text x="200" y="375" font-family="'Roboto', sans-serif"
            fill="black" font-size="18" text-anchor="middle" 
            alignment-baseline="middle">Корпус №6</text>

            <polygon id="8" 
                  className="Корпус" 
                  points="380,325 440,325 440,340 490,340 
                  490,325 590,325 590,340 640,340 640,325 
                  700,325 700,370 640,370 640,385 590,385 
                  590,370 490,370 490,385 440,385 440,370 
                  380,370" 
                  fill=" #E0E0E0" stroke="black" stroke-width="1" 
                  onClick={() => onPolygonClick('eighthBuilding')} />
            <text x="540" y="350" font-family="'Roboto', sans-serif"
            fill="black" font-size="18" text-anchor="middle" 
            alignment-baseline="middle">Корпус №8</text>

            <polygon id="1" 
                  className="Корпус" 
                  points="790,550 790,500 830,500 830,160 
                  880,160 880,240 980,240 980,280 880,280 
                  880,360 980,360 980,400 880,400 880,550" 
                  fill=" #E0E0E0" stroke="black" stroke-width="1"
                  onClick={() => onPolygonClick('firstBuilding')} />
            <text x="900" y="380" font-family="'Roboto', sans-serif"
            fill="black" font-size="18" text-anchor="middle" 
            alignment-baseline="middle">Корпус №1</text>

            <polygon id="12" 
                  className="Корпус" 
                  points="830,160 830,120 1080,120 1080,160" 
                  fill=" #E0E0E0" stroke="black" stroke-width="1" 
                  onClick={() => onPolygonClick('twelfthBuilding')} />
            <text x="900" y="140" font-family="'Roboto', sans-serif"
            fill="black" font-size="18" text-anchor="middle" 
            alignment-baseline="middle">Корпус №12</text>

            <polygon id="5" 
                  className="Корпус" 
                  points="1080,160 1080,110 1320,110 1320,160 1280,160 1280,280 
                  1300,280 1300,360 1280,360 1280,500 1240,500 1240,360 1220,360 1220,280 
                  1240,280 1240,160" 
                  fill=" #E0E0E0" stroke="black" stroke-width="1" />
            <text x="1160" y="140" font-family="'Roboto', sans-serif"
            fill="black" font-size="18" text-anchor="middle" 
            alignment-baseline="middle">Корпус №5</text>

            <polygon id="ЕНИ" 
                  className="Корпус" 
                  points="880,540 880,490 1040,490 1040,500 1100,500 1100,540" 
                  fill=" #E0E0E0" stroke="black" stroke-width="1" />
            <text x="980" y="515" font-family="'Roboto', sans-serif"
            fill="black" font-size="18" text-anchor="middle" 
            alignment-baseline="middle">ЕНИ</text>

            <polygon id="10" 
                  className="Корпус" 
                  points="1010,360 1010,405 1100,405 1100,360" 
                  fill=" #E0E0E0" stroke="black" stroke-width="1" />
            <text x="1055" y="385" font-family="'Roboto', sans-serif"
            fill="black" font-size="14" text-anchor="middle" 
            alignment-baseline="middle">Корпус №10</text>

            <polygon id="9" 
                  className="Корпус" 
                  points="1120,620 1120,700 1250,700 1250,620" 
                  fill=" #E0E0E0" stroke="black" stroke-width="1" />
            <text x="1180" y="660" font-family="'Roboto', sans-serif"
            fill="black" font-size="18" text-anchor="middle" 
            alignment-baseline="middle">Корпус №9</text>

            <polygon id="3" 
                  className="Корпус" 
                  points="940,640 940,780 990,780 990,640" 
                  fill=" #E0E0E0" stroke="black" stroke-width="1" />
            <text x="965" y="700" font-family="'Roboto', sans-serif"
            fill="black" font-size="15" text-anchor="middle" 
            alignment-baseline="middle">Корпус</text>

            <text x="965" y="720" font-family="'Roboto', sans-serif"
            fill="black" font-size="18" text-anchor="middle" 
            alignment-baseline="middle">№3</text>

            <polygon id='2' 
                  className="Корпус" 
                  points="750,640 750,680 810,680 810,740 
                  800,740 800,780 810,780 810,840 750,840 
                  750,880 880,880 880,840 860,840 860,780 
                  880,780 880,740 860,740 860,680 880,680 
                  880,640"  
                  fill=" #E0E0E0" stroke="black" stroke-width="1" />
            <text x="820" y="660" font-family="'Roboto', sans-serif"
            fill="black" font-size="18" text-anchor="middle" 
            alignment-baseline="middle">Корпус №2</text>

            <polygon id="Сад"
                  points="100,640 100,1000 700,1000 700,640" 
                  fill="rgb(156, 228, 138)" stroke="black" stroke-width="1" />
            <text x="400" y="700" font-family="'Roboto', sans-serif"
            fill="rgb(35, 114, 65)" font-size="25" text-anchor="middle" 
            alignment-baseline="middle">Ботанический</text>
            <text x="400" y="740" font-family="'Roboto', sans-serif"
            fill="rgb(35, 114, 65)" font-size="25" text-anchor="middle" 
            alignment-baseline="middle">сад ПГУ</text>
            <text x="400" y="780" font-family="'Roboto', sans-serif"
            fill="rgb(35, 114, 65)" font-size="25" text-anchor="middle" 
            alignment-baseline="middle">им. Генкеля</text>
    </>
    );
};
