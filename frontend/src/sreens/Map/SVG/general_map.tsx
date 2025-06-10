import fontanIcon from "./fontan.png"
import './general_map.scss';
interface GeneralMapProps {
      onPolygonClick: (buildingId: 'firstBuilding' | 'twelfthBuilding' | 'eighthBuilding' | 'fifthBuilding' | 'secondBuilding') => void; // Функция для обработки клика на полигон
    }

    export const GeneralMap: React.FC<GeneralMapProps> = ({ onPolygonClick }) => {
    return(
    <>
            <rect width="100%" height="100%" className="general-map-bg" />

            <polygon
                  points="335,250 350,590 700,590 700,300 600,300 600,80 580,70 480,80 350,100 300,160"
                  className="lawn" />

            <polygon
                  points="1330,500 1330,200 1450,370 "
                  className="lawn" />

            <polyline points="50,20 1330,40 1500,320 1300,320 1500,320 1300,550 1250,570 1200,600 710,600 710,1000 710,40 710,300 840,300
            710,300 710,600 50,600 540,600 540,350 540,430 700,430 540,430 355,430 540,430 370,540 540,430 670,540 540,430 540,540 700,540 350,540
            350,600 350,320 300,320 390,320 350,320 300,160 50,180 50,1000 50,10 50,180 300,160 330,130 350,100 450,90 550,70 710,80 600,75 600,290
            710,290 600,290 600,200 700,200"
                  className="road" />

            <image 
                  href={fontanIcon} 
                  x="510" y="460" 
                  width="60" height="60" 
                  data-associated-with="fontanIcon-1"/>

            <polygon id="Парковка"
                  className="parking"
                  points="80,50 80,170 300,150 300,50" />
            <text x="200" y="100" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Парковка</text>

            <polygon id="Студклуб"
                  className="building"
                  points="100,200 100,300 300,300 300,230 270,230 270,200" />
            <text x="200" y="250" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Студклуб</text>

            <polygon id="20"
                  className="building"
                  points="270,300 270,350 300,350 300,300" />

            <polygon id="6"
                  className="building"
                  points="100,350 100,550 300,550 300,350" />
            <polygon
                  points="150,400 150,500 250,500 250,400"
                  className="building" />
            <text x="200" y="375" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус №6</text>

            <polygon id="21"
                  className="building"
                  points="300,340 300,360 380,360 380,340" />

            <polygon id="8"
                  className="building"
                  points="380,325 440,325 440,340 490,340
                  490,325 590,325 590,340 640,340 640,325
                  700,325 700,370 640,370 640,385 590,385
                  590,370 490,370 490,385 440,385 440,370
                  380,370"
                  
                  onClick={() => onPolygonClick('eighthBuilding')} />
            <text x="540" y="350" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус №8</text>


            <polygon id="2"
                  className="building"
                  points="650,140 650,280 700,280 700,140 " />
            <text x="680" y="270" className="map-text" text-anchor="middle"  transform="rotate(90, 700, 230)"
            alignment-baseline="middle">Общежитие №2</text>

            <polygon id="22"
                  className="building"
                  points="700,340 700,360 840,360 840,340" />

            <polygon id="1"
                  className="building"
                  points="830,450 830,160
                  880,160 880,210 980,210 980,250 880,250
                  880,320 980,320 980,360 880,360 880,450"
                  onClick={() => onPolygonClick('firstBuilding')} />
            <text x="900" y="340" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус №1</text>

            <polygon id="12"
                  className="building"
                  points="830,160 830,120 1080,120 1080,160"
                  onClick={() => onPolygonClick('twelfthBuilding')} />
            <text x="900" y="140" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус №12</text>

            <polygon id="5"
                  className="building"
                  points="1080,160 1080,110 1320,110 1320,160 1280,160 1280,280
                  1300,280 1300,360 1280,360 1280,500 1240,500 1240,360 1220,360 1220,280
                  1240,280 1240,160"
                  onClick={() => onPolygonClick('fifthBuilding')}/>
            <text x="1160" y="140" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус №5</text>

            <polygon id="ЕНИ"
                  className="building"
                  points="780,580 780,520 820,520 820,450 890,450 890,520 980,520 980,560 890,560 890,580"
                  />
            <text x="850" y="515" className="map-text" text-anchor="middle"
            alignment-baseline="middle">ЕНИ</text>

            <polygon id="24"
                  className="building"
                  points="830,580 830,650 860,650 860,580" />

            <polygon id="23"
                  className="building"
                  points="980,335 980,350 1020,350 1020,335" />

            <polygon id="10"
                  className="building"
                  points="1010,320 1010,365 1100,365 1100,320"
                  />
            <text x="1055" y="345" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус №10</text>

            <polygon id="9"
                  className="building"
                  points="1120,620 1120,700 1250,700 1250,620"
                  />
            <text x="1180" y="660" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус №9</text>

            <polygon id="23"
                  className="building"
                  points="1140,700 1140,740 1160,740 1160,700" />

            <polygon id="11"
                  className="building"
                  points="1120,740 1120,850 1190,850 1190,740"
                  />
            <text x="1155" y="780" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус</text>
            <text x="1155" y="800" className="map-text" text-anchor="middle"
            alignment-baseline="middle">№11</text>

            <polygon id="3"
                  className="building"
                  points="940,640 940,780 990,780 990,640" />
            <text x="965" y="700" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус</text>

            <text x="965" y="720" className="map-text" text-anchor="middle"
            alignment-baseline="middle">№3</text>

            <polygon id="8"
                  className="building"
                  points="1020,620 1020,800 1070,800 1070,620 " />
            <text x="1020" y="670" className="map-text" text-anchor="middle" transform="rotate(90, 1020, 700)"
            alignment-baseline="middle">Общежитие №8</text>

            <polygon id='2'
                  className="building"
                  points="750,640 750,680 810,680 810,740
                  800,740 800,780 810,780 810,840 750,840
                  750,880 880,880 880,840 860,840 860,780
                  880,780 880,740 860,740 860,680 880,680
                  880,640"
                  onClick={() => onPolygonClick('secondBuilding')}/>
            <text x="820" y="660" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус №2</text>

            <polygon id='4'
                  className="building"
                  points="750,920 750,1000 790,1000 790,970 880,970 880,920 840,920 840,940 790,940 790,920"
                  />
            <text x="820" y="950" className="map-text" text-anchor="middle"
            alignment-baseline="middle">Корпус №4</text>

            <polygon id="Сад"
                  points="100,640 100,1000 700,1000 700,640"
                  className="lawn main-area" />
            <text x="400" y="700" className="garden-text" text-anchor="middle"
            alignment-baseline="middle">Ботанический</text>
            <text x="400" y="740" className="garden-text" text-anchor="middle"
            alignment-baseline="middle">сад ПГУ</text>
            <text x="400" y="780" className="garden-text" text-anchor="middle"
            alignment-baseline="middle">им. Генкеля</text>
    </>
    );
};
