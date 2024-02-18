import jwt from "jsonwebtoken";

import * as dotenv from "dotenv"
import client from "../db/index.js";
dotenv.config()

class AuthMiddleware{
    async authenticate(req,res,next){
        // for debug
        //console.log(req.url);
        //console.log(req.headers);
        let token,verify;

        // проверка верификации
        try{
            token = req.headers.authorization.split(' ')[1];
            verify = jwt.verify(token,process.env.KEY);
        } catch {
            res.status(403).send({message:"not authed", from:"AuthMiddleware"});
            return;
        }

        if (!verify){
            res.status(403).send({message:"invalid token", from:"AuthMiddleware"});
            return;
        }

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [verify.user_name])
        if (user.rowCount == 0){
            res.status(404).send({message:"user is not found", from:"AuthMiddleware"});
            return
        }
        user.rowCount == 1
        
        const {user_name,hash_password} = verify
        req.body.user = {user_name, hash_password, token};
        next();
                
        
    };
}

export default new AuthMiddleware