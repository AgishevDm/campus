import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import jwt from 'jsonwebtoken';
import prisma from './prisma';
import { Chat, Message } from '@prisma/client';

interface WS extends WebSocket {
  userId?: string;
}

const clients = new Map<string, Set<WS>>();

export const setupWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    if (!token) {
      socket.destroy();
      return;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { primarykey: string };
      wss.handleUpgrade(req, socket, head, ws => {
        const client = ws as WS;
        client.userId = decoded.primarykey;
        if (!clients.has(client.userId)) clients.set(client.userId, new Set());
        clients.get(client.userId)!.add(client);
        wss.emit('connection', client, req);
      });
    } catch {
      socket.destroy();
    }
  });

  wss.on('connection', ws => {
    ws.on('close', () => {
      const userId = (ws as WS).userId;
      if (userId) {
        clients.get(userId)?.delete(ws as WS);
      }
    });
  });
};

export const broadcastChatCreated = (chat: Chat, userIds: string[]) => {
  const payload = JSON.stringify({ type: 'chatCreated', chat });
  userIds.forEach(id => {
    clients.get(id)?.forEach(ws => ws.send(payload));
  });
};

export const broadcastMessage = async (message: Message, chatId: string) => {
  const participants = await prisma.chatParticipant.findMany({ where: { chatId } });
  const payload = JSON.stringify({ type: 'message', chatId, message });
  participants.forEach(p => {
    clients.get(p.accountId)?.forEach(ws => ws.send(payload));
  });
};
