import { Server } from 'socket.io';
import http from 'http';

export let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', socket => {
    socket.on('auth', (userId: string) => {
      socket.join(userId);
    });
    socket.on('joinChat', (chatId: string) => {
      socket.join(chatId);
    });
  });
};
