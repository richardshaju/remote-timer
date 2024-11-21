// app/api/socketio/route.ts
import { Server } from 'socket.io';
import { createServer } from 'http';

const SOCKET_PORT =  3001;


const httpServer = createServer();
const io = new Server(httpServer, {
    addTrailingSlash: false,
    cors: {
        origin: "*"
    }
});

    io.on('connection', (socket) => {

      
      console.log('Client connected');

      socket.on('setTimer', (time) => {
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