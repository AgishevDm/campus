import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import app from './application';
import jwt from 'jsonwebtoken';
import redisClient from './config/redis';
import { createMessage } from './services/chatService';
import prisma from './prisma';

const server = http.createServer(app);
export const wss = new WebSocketServer({ server });

interface AuthedSocket extends WebSocket {
  userId?: string;
}

const connections: Record<string, AuthedSocket[]> = {};

wss.on('connection', async (ws, req) => {
  const url = new URL(req.url || '', 'http://localhost');
  const token = url.searchParams.get('token');
  if (!token) {
    ws.close();
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { primarykey: string };
    const stored = await redisClient.get(`token:${decoded.primarykey}`);
    if (!stored || stored !== token) throw new Error('invalid');
    const socket = ws as AuthedSocket;
    socket.userId = decoded.primarykey;
    if (!connections[decoded.primarykey]) connections[decoded.primarykey] = [];
    connections[decoded.primarykey].push(socket);
  } catch (err) {
    console.error('WebSocket auth error:', err);
    ws.close();
    return;
  }

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'sendMessage') {
        const { chatId, text } = msg;
        const senderId = (ws as AuthedSocket).userId as string;
        const message = await createMessage(chatId, senderId, text);
        const participants = await prisma.chatParticipant.findMany({ where: { chatId } });
        for (const p of participants) {
          const userCons = connections[p.accountId] || [];
          for (const c of userCons) {
            c.send(JSON.stringify({ type: 'message', chatId, message }));
          }
        }
      }
    } catch (e) {
      console.error('WS message error:', e);
    }
  });

  ws.on('close', () => {
    const userId = (ws as AuthedSocket).userId as string;
    if (userId && connections[userId]) {
      connections[userId] = connections[userId].filter(c => c !== ws);
    }
  });
});

export default server;
