// pages/api/socketio.ts
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!(res.socket as any).server.io) {
    const httpServer: NetServer = (res.socket as any).server;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });
    (res.socket as any).server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected');
      
      socket.on('setTimer', (time: number) => {
        io.emit('updateTimer', time);
      });

      socket.on('startTimer', () => {
        io.emit('timerStart');
      });

      socket.on('stopTimer', () => {
        io.emit('timerStop');
      });
    });
  }
  res.end();
};

export default ioHandler;