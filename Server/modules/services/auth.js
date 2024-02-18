import client from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv"

dotenv.config()


function update_token(user_name,hash_password){
    const newToken = jwt.sign({user_name,hash_password}, process.env.KEY,{expiresIn:"7d"});
    client.query(`UPDATE users SET token = $1 WHERE user_name = $2`,[newToken,user_name]);
    return newToken

};



// try catch
class UserService {

    async init () {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            token VARCHAR(512) NOT NULL,
            first_name VARCHAR(32) NOT NULL,
            user_name VARCHAR(32) NOT NULL UNIQUE,
            hash_password VARCHAR(255) NOT NULL
            );`)
    };

    async register (req,res){

        let first_name, password, user_name
        try {
            ({first_name, password, user_name} = req.body)
        } catch (error) {
            res.status(400).send("incorrect data");
            return
        }


        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`,[user_name]);


        if(user.rowCount >= 1){
            res.status(403).send({message:"User already exist"});
            return
        }



        const hash_password = await bcrypt.hash(password,Number(process.env.SALT))
    
        const token = jwt.sign({user_name,hash_password}, process.env.KEY,{expiresIn:"7d"})

        await client.query(`INSERT INTO users(first_name,hash_password,token,user_name) VALUES($1,$2,$3,$4)`, [first_name,hash_password,token,user_name]);
        res.status(200).send({ message:{ user:{ token, first_name, user_name }}})

    };

    async remove(req,res){
        let token
        try {
            ({ token } = req.body)
        } catch (error) {
            res.status(400).send("incorrect data");
            return
        }

        client.query(`DELETE FROM users WHERE token = $1`,[token]);
        res.status(200)


    };
    
    async get_token(req,res){


        let name,hash_password
        try {
            ({ name,hash_password} = req.body )
        } catch (error) {
            res.status(400).send("incorrect data");
            return
        }


        const token = await client.query(`SELECT * FROM users WHERE name = $1 AND hash_password = $2`,[name,hash_password]);


        if(token.rowCount === 0){
            res.status(404).send("no such user") 
            return
        }

        res.status(200).send(token.rows[0]) 
    };

    async login(req,res){

        let user_name, password
        try {
            ({user_name, password} = req.body )
        } catch (error) {
            res.status(400).send("incorrect data");
            return
        }


        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`,[user_name]);

        
        if (user.rows.length === 0){
            res.status(404).send({message:"No such user"});
            return
        }
        const {hash_password} = user.rows[0]
            
        if(!bcrypt.compare(password ,hash_password)){
            res.status(403).send({message:"wrong password"})
            
            return
        }
        
        const newToken = update_token(user_name,hash_password)

        res.status(200).send({ message:{ user:{ token:newToken, first_name:user.rows[0].first_name, user_name}}})
    };

    async valid_token(req,res){

        
        let user_name, hash_password
        try {
            ({user_name, hash_password} = req.body.user)
        } catch (error) {
            res.status(400).send("incorrect data");
            return
        }

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`,[user_name]);
        
        if (user.rows.length === 0){
            res.status(404).send({ message:{ text:"no such user"}})
            return
        }

        if(user.rows[0].hash_password !== hash_password){
            res.status(403).send({message:"wrong password"})
            return
        }
        
        const newToken = update_token(user_name,hash_password)
    
        res.status(200).send({message:{user:{ token:newToken, first_name:user.rows[0].first_name, user_name}}})
    };

};

const userService = new UserService()

export default userService