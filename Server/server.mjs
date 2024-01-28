import * as dotenv from "dotenv";
dotenv.config({path:"d:\\Projects\\Uncomplited\\WebRPG\\Server\\.env"});


import express from 'express';
import cors from "cors";
import { createServer } from 'node:http';
import { Server } from "socket.io";

import router from "./modules/routes/index.js";

import UserService from "./modules/services/auth.js";
import RoomService from "./modules/services/room.services.js";
import GameDataService from './modules/services/gameData.services.js';






// to .env
const PORT = process.env.PORT
const HOST = process.env.HOST


const app = express();
app.use(cors())
app.use(express.json());
app.use("/api",router)

const server = createServer(app)
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
});





const start = async() => {
    
    GameDataService.init_const();

    UserService.init();
    RoomService.init();
    
    
    

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
        console.log(`Join at http://${HOST}:${PORT}`);
    });
};


start();
