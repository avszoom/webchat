"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const faker_1 = require("@faker-js/faker");
const peer_1 = require("peer");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
//http server running on port 3000
const server = http_1.default.createServer(app);
// //web socket on same port
// const io = new Server(server);
const peerServer = (0, peer_1.ExpressPeerServer)(server, {});
app.use("/peerjs", peerServer);
app.use((0, cors_1.default)());
let users = new Map;
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const usersList = Array.from(users.keys()).filter((id) => id != userId);
    res.send({
        users: usersList.map((id) => users.get(id)),
    });
});
app.get('/getUserId/:user', (req, res) => {
    const userName = req.params.user;
    const userId = Array.from(users.keys()).filter((id) => users.get(id) == userName);
    res.send({
        userId: userId,
    });
});
function generateRandomName() {
    return faker_1.faker.person.fullName(); // Generates a random name
}
peerServer.on('connection', (client) => {
    console.log("new user connected", client.getId());
    users.set(client.getId(), generateRandomName());
});
peerServer.on('disconnect', (client) => {
    console.log("user got disconnected");
    users.delete(client.getId());
});
server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
