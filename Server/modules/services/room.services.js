import  client  from "../db/index.js";

const MAX_USER_IN_ROOM = 10;


class RoomService {

    async init () {
        client.query("BEGIN");
        client.query(`
            CREATE TABLE IF NOT EXISTS rooms (
            id SERIAL PRIMARY KEY,
            name VARCHAR(32) NOT NULL,
            user_count INT NOT NULL DEFAULT 1,
            owner_id SERIAL REFERENCES users(id)
            );`);

        client.query(`
            CREATE TABLE IF NOT EXISTS room_members (
            id SERIAL PRIMARY KEY,
            room_id SERIAL REFERENCES rooms(id),
            user_id SERIAL REFERENCES users(id)
            );`);
        client.query("COMMIT");
    };

    async create (req, res){

        const { roomName } = req.body;
        const { user_name } = req.body.user

        if(/^\w+$/.test(roomName)){
            res.status(400).send("invalid roomName");
            return;
        }

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name])
        const owner = await client.query(`SELECT * FROM rooms WHERE owner_id = $1`,[user.rows[0].id]);
        const rooms = await client.query(`SELECT * FROM rooms WHERE name = $1`,[roomName]);


        if (rooms.rows.length !== 0){

            res.status(403).send(`there is already room with name ${roomName}`);

        }else if (owner.rows.length !== 0){

            res.status(403).send("user already have room");

        }else{

            client.query(`INSERT INTO rooms(name,owner_id) VALUES($1,$2);`,[roomName,user.rows[0].id]);
            this.connect(req,res)
            res.status(200).send("success");

        }

    };
    
    async connect (req, res){
        
        const { roomName } = req.body;
        const { token } = req.body.user

        const room = await client.query(`SELECT * FROM rooms WHERE name = $1`,[roomName]);


        if (room.rows.length === 0){
            res.status(404).send({message:"No such room"})

        }else if(room.rows[0].user_count == MAX_USER_IN_ROOM){
            res.status(400).send({message:"room is full"})
        }else{

            const user_id = (await client.query(`SELECT * FROM users WHERE token = $1`,[token])).rows[0].id;
            const room_id = room.rows[0].id;

            client.query("BEGIN")
            client.query(`INSERT INTI room_members VALUES($1,$2)`, [room_id, user_id]);
            client.query(`UPDATE rooms SET user_count = $1 WHERE id = $2`,[room.rows[0].user_count + 1, room.rows[0].id])
            client.query("COMMIT")

            res.status(200).send({message:`you are at ${roomName}`})
        }
    };

    async disconnect(req, res){
        const user_name = req.body.user

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name])
        const user_id = user.rows[0].id
        const connection = client.query(`SELECT * FROM room_members WHERE user_id = $1`, [user_id])
        const room = await client.query(`SELECT * FROM rooms WHERE id = $1`,[connection.rows[0].room_id]);

        client.query(`BEGIN`);
        client.query(`UPDATE rooms SET user_count = $1 WHERE id = $2`,[room.rows[0].user_count - 1, connection.rows[0].room_id]);
        client.query(`DELETE FROM room_members WHERE user_id = $1`, [user_id]);
        client.query(`COMMIT`);

        res.status(200),send({message:"you leaved room"});

    };

    async deleteRoomByOwner(req,res){
        await client.query(`DELETE FROM rooms WHERE owner = $1;`,[req.body.token]);
        
        res.status(200);
    };

    async checkConnection(req,res){

        const {user_name} = req.body.user

        const user = await client.query(`SELECT * FROM users WHERE user_name = $1`, [user_name])
        const room = await client.query(`SELECT * FROM room_members WHERE user_id = $1`, [ user.rows[0].id])

        if (room.rowCount === 0){
            res.status(404).send({message:"user is not connected"})
        }else{
            res.status(200).send({message:`user is in ${room.rows[0].name}`, room_name:room.rows[0].name})
        }
    }
};



export default new RoomService