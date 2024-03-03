import "./temp_solve.js"

import express from 'express';
import cors from "cors";
import http from "http"

import router from "./modules/routes/index.js";

import UserService from "./modules/services/auth.js";
import RoomService from "./modules/services/room.services.js";
import GameDataService from './modules/services/gameData.services.js';
import { startSocketServer } from "./modules/socketio/socketio.js";

const server = http.createServer()

const PORT = process.env.PORT

const app = express();
app.use(cors())
app.use(express.json());
app.use("/api",router)

async function start(){

    // запуск базы данныхw
    UserService.init();
    RoomService.init();
    GameDataService.init_const();
    
    startSocketServer(server)

    app.listen(PORT, () => {
        console.log(`Server has successfully started`);
    });
};

start();