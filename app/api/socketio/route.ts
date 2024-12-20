// app/api/socketio/route.ts
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

let io: SocketIOServer | null = null;
let httpServer: ReturnType<typeof createServer> | undefined;

const SOCKET_PORT =  3001;


if (!httpServer) {
  httpServer = createServer();
}

export async function GET() {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ['GET', 'POST'],
      }
    });

    io.on('connection', (socket) => {

      
      console.log('Client connected');

      socket.on('setTimer', (time: number) => {
        io?.emit('updateTimer', time);
      });

      socket.on('startTimer', () => {
        io?.emit('timerStart');
      });

      socket.on('stopTimer', () => {
        io?.emit('timerStop');
      });

      socket.on('setTitle', (title) => {
        io?.emit('getTitle', title);
      });

      socket.on('setPlayAudio', (value) => {
        io?.emit('getPlayAudio', value);
      });

      socket.on('resetTimer', (time) => {
        console.log('resetTimer', time);
        
        io?.emit('updateTimer', time);
      });
    });

    httpServer?.listen(SOCKET_PORT, () => {
      console.log(`Socket.IO server running on port ${SOCKET_PORT}`);
    });
  }

  return NextResponse.json({ success: true });
}