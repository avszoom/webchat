import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http  from 'http';
import { faker } from '@faker-js/faker';
import { ExpressPeerServer} from 'peer';
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
//http server running on port 3000
const server = http.createServer(app);
// //web socket on same port
// const io = new Server(server);

const peerServer = ExpressPeerServer(server, {
});

app.use("/peerjs", peerServer);
app.use(cors());

let users = new Map;

app.get('/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const usersList = Array.from(users.keys()).filter((id) => id != userId);
  res.send({
    users: usersList.map((id) => users.get(id)),
  });
});

app.get('/getUserId/:user', (req: Request, res: Response) => {
  const userName = req.params.user;
  const userId = Array.from(users.keys()).filter((id) => users.get(id) == userName);
  res.send({
    userId: userId,
  });
});

function generateRandomName() {
  return faker.person.fullName(); // Generates a random name
}

peerServer.on('connection', (client) => { 
  console.log("new user connected", client.getId()) 
  users.set(client.getId(),generateRandomName());
});

peerServer.on('disconnect', (client) => {
  console.log("user got disconnected");
  users.delete(client.getId());
});


server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});