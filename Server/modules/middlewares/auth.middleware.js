import jwt from "jsonwebtoken";

import * as dotenv from "dotenv"
dotenv.config()

class AuthMiddleware{
    async authenticate(req,res,next){
        try{
            const token = req.headers.authorization?.split(' ')[1];
            const verify = jwt.verify(token,process.env.KEY);

            if (!verify){
                res.status(403).send({message:"invalid token"});
            }else{ 
                req.body.user = {user_name:verify.user_name,
                                hash_password:verify.hash_password,
                                token:token};
                next();
            }
        } catch {
            res.status(403).send({message:"not authed"});
        }
    };
}

export default new AuthMiddleware