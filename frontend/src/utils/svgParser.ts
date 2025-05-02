// // utils/svgUtils.ts
// import { Room, Door } from '../types/map';

// export function extractRoomsFromSVG(svgElement: SVGSVGElement): Room[] {
//   const rooms: Room[] = [];
//   const corridor = svgElement.querySelector('.corridor') as SVGPolygonElement;
  
//   // Добавляем коридор
//   if (corridor) {
//     rooms.push({
//       id: 'corridor-1',
//       name: 'Коридор',
//       type: 'corridor',
//       points: corridor.getAttribute('points') || '',
//       doors: [],
//       neighbors: [],
//       floor: 1
//     });
//   }

//   // Парсим кабинеты
//   svgElement.querySelectorAll('.кабинеты').forEach((el, i) => {
//     const polygon = el as SVGPolygonElement;
//     const roomNumber = polygon.querySelector('text')?.textContent || `${i+1}`;
    
//     rooms.push({
//       id: `room-${roomNumber}`,
//       name: `Кабинет ${roomNumber}`,
//       type: 'room',
//       points: polygon.getAttribute('points') || '',
//       doors: detectDoors(polygon, 'corridor-1'),
//       neighbors: ['corridor-1'],
//       floor: 1
//     });
//   });

//   // Обрабатываем лестницы и лифты
//   svgElement.querySelectorAll('.лесницы, .лифты').forEach(el => {
//     const polygon = el as SVGPolygonElement;
//     const type = el.classList.contains('лесницы') ? 'stairs' : 'elevator';
    
//     rooms.push({
//       id: polygon.id || `${type}-1`,
//       name: type === 'stairs' ? 'Лестница' : 'Лифт',
//       type,
//       points: polygon.getAttribute('points') || '',
//       doors: [
//         { x: getCenterX(polygon), y: getCenterY(polygon), leadsTo: 'corridor-1' },
//         { x: getCenterX(polygon), y: getCenterY(polygon), leadsTo: `${type}-2`, floor: 2 }
//       ],
//       neighbors: ['corridor-1', `${type}-2`],
//       floor: 1
//     });
//   });

//   return rooms;
// }

// function detectDoors(element: SVGPolygonElement, defaultTarget: string): Door[] {
//   const points = element.getAttribute('points')?.split(' ') || [];
//   const centerX = getCenterX(element);
//   const centerY = getCenterY(element);
  
//   // Простая логика - дверь в центре ближайшей к коридору стороны
//   return [{
//     x: centerX,
//     y: centerY,
//     leadsTo: defaultTarget
//   }];
// }

// function getCenterX(polygon: SVGPolygonElement): number {
//   const points = polygon.getAttribute('points')?.split(' ').map(p => p.split(',').map(Number)) || [];
//   return points.reduce((sum, [x]) => sum + x, 0) / points.length;
// }

// function getCenterY(polygon: SVGPolygonElement): number {
//   const points = polygon.getAttribute('points')?.split(' ').map(p => p.split(',').map(Number)) || [];
//   return points.reduce((sum, [,y]) => sum + y, 0) / points.length;
// }

export {}