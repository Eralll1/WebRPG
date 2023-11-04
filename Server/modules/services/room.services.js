import  client  from "../db/index.js";
import UserService from "./auth.js";

class RoomService {

    async init () {
        client.query(`
            CREATE TABLE IF NOT EXISTS rooms (
            id SERIAL PRIMARY KEY,
            name VARCHAR(32) NOT NULL,
            user_count INT NOT NULL DEFAULT 0,
            owner_token VARCHAR(255) NOT NULL
            );`)
    };

    async create (req, res){

        const { name, token } = req.body;
        
        const owner = await client.query(`SELECT * FROM rooms WHERE owner_token = $1`,[token]);
        const rooms = await client.query(`SELECT * FROM rooms WHERE name = $1`,[name]);

        if (rooms.rows.length !== 0){

            res.status(403).send(`there is already room with name ${name}`);

        }else if (owner.rows.length !== 0){

            res.status(403).send("user already have room");

        }else{

            client.query(`INSERT INTO rooms VALUES($1);`,[name]);
            res.status(201).send("success");

        }

    };
    
    async connect (req, res){
        
        const {token,name} = req.body;

        const room = await client.query(`SELECT * FROM rooms WHERE name = $1`,[name]);


        if (room.rows.length === 0){
            res.status(404).send({message:"No such room"})
        }else{

            client.query(`UPDATE users SET room_id = $1 WHERE token = $2;`,[room.rows[0].room_id,token])

            res.status(200).send({message:`you are at ${room_id} ${name}`})
        }

        
    };

    async getRoomByName(req,res){
        const {name} = req.body;
        let rooms = await client.query(`SELECT * FROM rooms where name = $1;`,[name])
        if (rooms.rows.length === 0) {
            res.status(404).send({message:"No such room"})
        }else{
            res.status(200).send(rooms.rows[0]);
        }
    };

    async deleteRoomByOwner(req,res){
        await client.query(`DELETE FROM ROOMS WHERE owner = $1;`,[req.body.token]);
        
        res.status(200);
    };
};



export default new RoomService