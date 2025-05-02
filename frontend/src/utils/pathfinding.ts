// src/utils/pathfinder.ts

import { RoomData } from "../data/eighthBuildingData";
import { RoutePoint } from '../types/map'

export class Pathfinder {
    private graph: Record<string, Record<string, number>> = {};
  
    constructor(rooms: RoomData[]) {
      this.buildGraph(rooms);
    }
  
    private buildGraph(rooms: RoomData[]) {
      rooms.forEach(room => {
        if (!room.neighbors) return;
        
        this.graph[room.id] = {};
        room.neighbors.forEach(neighborId => {
          const neighbor = rooms.find(r => r.id === neighborId);
          if (neighbor && neighbor.entrance && room.entrance) {
            const dx = room.entrance.x - neighbor.entrance.x;
            const dy = room.entrance.y - neighbor.entrance.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.graph[room.id][neighborId] = distance;
          }
        });
      });
    }
  
    findPath(startId: string, endId: string): string[] {
      const distances: Record<string, number> = {};
      const prev: Record<string, string | null> = {};
      const queue = new Set<string>();
      
      // Инициализация
      Object.keys(this.graph).forEach(vertex => {
        distances[vertex] = vertex === startId ? 0 : Infinity;
        prev[vertex] = null;
        queue.add(vertex);
      });
      
      while (queue.size > 0) {
        const current = this.getMinDistanceVertex(queue, distances);
        queue.delete(current);
        
        if (current === endId) break;
        
        for (const neighbor in this.graph[current]) {
          const alt = distances[current] + this.graph[current][neighbor];
          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            prev[neighbor] = current;
          }
        }
      }
      
      // Восстановление пути
      const path: string[] = [];
      let current = endId;
      while (current !== startId && prev[current] !== null) {
        path.unshift(current);
        current = prev[current]!;
      }
      if (current === startId) path.unshift(startId);
      
      return path.length > 1 ? path : [];
    }
  
    private getMinDistanceVertex(queue: Set<string>, distances: Record<string, number>): string {
      let minDistance = Infinity;
      let minVertex = '';
      
      queue.forEach(vertex => {
        if (distances[vertex] < minDistance) {
          minDistance = distances[vertex];
          minVertex = vertex;
        }
      });
      
      return minVertex;
    }

    findPathWithPoints(startId: string, endId: string, rooms: RoomData[]): RoutePoint[] {
        const path = this.findPath(startId, endId);
        if (path.length === 0) return [];
      
        const points: RoutePoint[] = [];
        const corridor = rooms.find(r => r.id === 'corridor-1');
        
        for (const roomId of path) {
          const room = rooms.find(r => r.id === roomId);
          if (!room?.entrance) continue;
      
          // Добавляем точку входа
          points.push({ 
            x: room.entrance.x, 
            y: room.entrance.y,
            inCorridor: room.id === 'corridor-1'
          });
      
          // Добавляем промежуточные точки коридора
          if (room.id === 'corridor-1' && corridor?.pathPoints) {
            const prevRoom = rooms.find(r => r.id === path[path.indexOf(roomId)-1]);
            const nextRoom = rooms.find(r => r.id === path[path.indexOf(roomId)+1]);
            
            // Фильтруем только нужные точки коридора
            const relevantPoints = corridor.pathPoints.filter(p => 
              p.x > (prevRoom?.entrance?.x || 0) && 
              p.x < (nextRoom?.entrance?.x || Infinity)
            );
            
            points.push(...relevantPoints.map(p => ({
              x: p.x,
              y: p.y,
              inCorridor: true
            })));
          }
        }
        
        return points;
      }
  }