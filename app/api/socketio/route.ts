// app/api/socketio/route.ts
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

let io: SocketIOServer | null = null;
let httpServer: any;

if (!httpServer) {
  httpServer = createServer();
}

export async function GET() {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
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
    });

    httpServer.listen(3001);
  }

  return NextResponse.json({ success: true });
}