// server.ts
import express from 'express';
import next from 'next';
import http from 'http';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);
    socket.on('message', (data) => {
      io.emit('message', data);
    });
    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected.`);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
});
