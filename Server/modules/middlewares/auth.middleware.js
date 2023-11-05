import jwt from "jsonwebtoken";

import * as dotenv from "dotenv"
dotenv.config()

class AuthMiddleware{
    async authenticate(req,res,next){
        
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token === undefined){
            res.status(403).send({message:"not authed"})
        

        }else{
            const verify =jwt.verify(token,process.env.KEY)
            
            
            if (!verify){
                res.status(403).send({message:"invalid token"})
            }else{
                
                req.body.user = {user_name:verify.user_name,
                                 hash_password:verify.hash_password}
                next();
            }
        }
        
        
    };
}

export default new AuthMiddleware