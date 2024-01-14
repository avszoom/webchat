import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http  from 'http';
import { Server } from "socket.io";
import { Socket } from "dgram";
import { faker } from '@faker-js/faker';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

let users = new Map;

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/index.html');
});

function generateRandomName() {
  return faker.person.fullName(); // Generates a random name
}

io.on('connection', (socket) => {
  console.log("New user connected ");
  users.set(socket,generateRandomName());
  users.forEach((value: boolean, key: Socket) => {
    const userList = Array.from(users.keys()).filter((s) => s != socket);
    socket.emit('user_list',{
      users: userList.map((user) => users.get(user))
    });
    console.log("sending usersList server");
  });

  // on receiving chat messages
  socket.on('chat message', (msg) => {
  });

  //on getting disconnected
  socket.on('disconnect', () => {
    users.delete(socket);
    console.log("User got disconnected");
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});