import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http  from 'http';
import { Server } from "socket.io";
import { Socket } from "dgram";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

let users = new Map;

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log("New user connected ");
  users.set(socket,true);
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message',msg);
    console.log(msg);
  });
  socket.on('disconnect', () => {
    users.set(socket,false);
    console.log("User got disconnected");
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});