import express from "express";
import UserService from "../../services/auth.js";
import authMiddleware from "../../middlewares/auth.middleware.js";


export const users = express.Router();

users.post('/register',UserService.register);
users.post("/login",UserService.login)


users.post("/remove",
            authMiddleware.authenticate,
            UserService.remove);

users.get("/get_token",
            authMiddleware.authenticate,
            UserService.get_token);

users.post("/valid_token",
           authMiddleware.authenticate,
           UserService.valid_token)
