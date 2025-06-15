import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';

interface WsWithUser extends WebSocket {
  userId?: string;
}

const clients = new Map<string, Set<WsWithUser>>();

export const initWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WsWithUser, req) => {
    const url = new URL(req.url || '', 'http://localhost');
    const token = url.searchParams.get('token');
    if (!token) return ws.close();

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { primarykey: string };
      ws.userId = decoded.primarykey;
      if (!clients.has(ws.userId)) clients.set(ws.userId, new Set());
      clients.get(ws.userId)!.add(ws);

      ws.on('close', () => {
        clients.get(ws.userId!)?.delete(ws);
      });
    } catch {
      ws.close();
    }
  });
};

export const sendToUser = (userId: string, payload: unknown) => {
  const msg = JSON.stringify(payload);
  const set = clients.get(userId);
  if (set) {
    set.forEach(ws => ws.send(msg));
  }
};
