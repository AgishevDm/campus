import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import prisma from './prisma';
import { addMessage } from './services/chatService';

const clients = new Map<string, WebSocket>();

type Incoming =
  | { type: 'sendMessage'; chatId: string; text: string };

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', 'http://localhost');
    const token =
      url.searchParams.get('token') ||
      req.headers.authorization?.split(' ')[1];
    if (!token) {
      ws.close();
      return;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        primarykey: string;
      };
      const userId = decoded.primarykey;
      clients.set(userId, ws);
      ws.on('close', () => clients.delete(userId));

      ws.on('message', async (data) => {
        try {
          const msg = JSON.parse(data.toString()) as Incoming;
          if (msg.type === 'sendMessage') {
            const saved = await addMessage(msg.chatId, userId, msg.text);
            const participants = await prisma.chatParticipant.findMany({
              where: { chatId: msg.chatId },
              select: { userId: true },
            });
            const payload = JSON.stringify({ type: 'newMessage', message: saved });
            participants.forEach((p) => {
              const client = clients.get(p.userId);
              if (client && client.readyState === WebSocket.OPEN) {
                client.send(payload);
              }
            });
          }
        } catch (e) {
          console.error('ws message error', e);
        }
      });
    } catch (err) {
      console.error('ws auth error', err);
      ws.close();
    }
  });
}
