import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import jwt from 'jsonwebtoken';
import redisClient from './config/redis';
import prisma from './prisma';
import { createMessage } from './services/chatService';

const clients = new Map<string, WebSocket>();

export const initWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws, req) => {
    const url = new URL(req.url || '', 'http://localhost');
    const token = url.searchParams.get('token');
    if (!token) {
      ws.close();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { primarykey: string };
      const storedToken = await redisClient.get(`token:${decoded.primarykey}`);
      if (!storedToken || storedToken !== token) {
        ws.close();
        return;
      }
      const userId = decoded.primarykey;
      clients.set(userId, ws);

      ws.on('message', async (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'message') {
            const saved = await createMessage(msg.chatId, userId, msg.content);
            const chatUsers = [saved.senderId];
            const chat = await prisma.chat.findUnique({ where: { id: msg.chatId } });
            if (chat) {
              chatUsers.push(chat.participant1Id === userId ? chat.participant2Id : chat.participant1Id);
            }
            for (const u of chatUsers) {
              const client = clients.get(u);
              if (client && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'message', message: saved }));
              }
            }
          }
        } catch (err) {
          console.error('WS message error', err);
        }
      });

      ws.on('close', () => {
        clients.delete(userId);
      });
    } catch (err) {
      console.error('WS auth error', err);
      ws.close();
    }
  });

  return wss;
};
