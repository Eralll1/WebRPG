import jwt from "jsonwebtoken";

import * as dotenv from "dotenv"
dotenv.config()

class AuthMiddleware{
    async authenticate(req,res,next){
        
        const { token } = req.body;
        if (token === undefined){
            res.status(403).send({message:"not authed"})
        

        }else{
            const verify =jwt.verify(token,process.env.KEY)
            
            if (!verify){
                res.status(403).send({message:"invalid token"})
            }else{
                console.log(verify)
                req.body.user = {user_name:verify.user_name,
                                 hash_password:verify.hash_password}
                next();
            }
        }
        
        
    };
}

export default new AuthMiddleware