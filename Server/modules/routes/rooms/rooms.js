import express from "express";
import RoomService from "../../services/room.services.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

export const rooms = express.Router();

rooms.use(authMiddleware.authenticate)

rooms.post("/create", RoomService.create);

rooms.post("/connect", RoomService.connect);

rooms.get("/disconnect", RoomService.disconnect);

rooms.get("/checkConnection", RoomService.checkConnection);

rooms.post("/deleteRoomByOwner", RoomService.deleteRoomByOwner);