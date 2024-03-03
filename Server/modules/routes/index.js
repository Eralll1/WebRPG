import express from "express";
import { rooms } from "./rooms/rooms.js";
import { users } from "./users/users.js";

const router = express.Router();

router.use("/rooms",rooms)
router.use("/users",users)


export default router;